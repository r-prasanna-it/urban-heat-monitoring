const mongoose = require('mongoose');

function createAdapter(MongooseModel, initialData = []) {
  let memoryItems = JSON.parse(JSON.stringify(initialData)).map((item, idx) => ({
    _id: item._id || 'id_' + (idx + 1) + '_' + Math.random().toString(36).substring(2, 7),
    ...item,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));

  return {
    async find(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.find(filter).sort({ createdAt: -1 });
      }
      return [...memoryItems].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    },

    async findById(id) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.findById(id);
      }
      return memoryItems.find((item) => String(item._id) === String(id)) || null;
    },

    async findOne(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.findOne(filter);
      }
      return (
        memoryItems.find((item) => {
          return Object.keys(filter).every((k) => {
            if (typeof item[k] === 'string' && typeof filter[k] === 'string') {
              return item[k].toLowerCase() === filter[k].toLowerCase();
            }
            return item[k] === filter[k];
          });
        }) || null
      );
    },

    async create(data) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.create(data);
      }
      const newItem = {
        _id: 'id_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryItems.unshift(newItem);
      return newItem;
    },

    async findByIdAndUpdate(id, updateData, options = {}) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      }
      const idx = memoryItems.findIndex((item) => String(item._id) === String(id));
      if (idx === -1) return null;
      memoryItems[idx] = {
        ...memoryItems[idx],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      return memoryItems[idx];
    },

    async findByIdAndDelete(id) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.findByIdAndDelete(id);
      }
      const idx = memoryItems.findIndex((item) => String(item._id) === String(id));
      if (idx === -1) return null;
      const deleted = memoryItems.splice(idx, 1)[0];
      return deleted;
    },

    async countDocuments(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.countDocuments(filter);
      }
      if (Object.keys(filter).length === 0) return memoryItems.length;
      return memoryItems.filter((item) =>
        Object.keys(filter).every((k) => item[k] === filter[k])
      ).length;
    },

    getMongooseModel() {
      return MongooseModel;
    },
  };
}

module.exports = { createAdapter };
