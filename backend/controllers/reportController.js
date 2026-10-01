const { Hotspot, GreenCover, WeatherStation, CoolingInitiative } = require('../models');

// @desc    Get aggregated report statistics
// @route   GET /api/reports/summary
const getReportSummary = async (req, res) => {
  try {
    const [hotspots, greenCovers, weatherStations, coolingInitiatives] = await Promise.all([
      Hotspot.find(),
      GreenCover.find(),
      WeatherStation.find(),
      CoolingInitiative.find(),
    ]);

    const totalHotspots = hotspots.length;
    const highSeverityHotspots = hotspots.filter((h) => h.severity === 'High').length;
    const mediumSeverityHotspots = hotspots.filter((h) => h.severity === 'Medium').length;
    const lowSeverityHotspots = hotspots.filter((h) => h.severity === 'Low').length;

    // Average hotspot temperature
    const avgTemp =
      totalHotspots > 0
        ? (hotspots.reduce((sum, h) => sum + Number(h.temperature || 0), 0) / totalHotspots).toFixed(1)
        : 0;

    // Average green cover %
    const avgGreenCover =
      greenCovers.length > 0
        ? (
            greenCovers.reduce((sum, g) => sum + Number(g.greenCoverPercentage || 0), 0) /
            greenCovers.length
          ).toFixed(1)
        : 0;

    // Active weather stations
    const activeWeatherStations = weatherStations.filter((w) => w.status === 'Active').length;
    const totalWeatherStations = weatherStations.length;

    // Total and status of cooling initiatives
    const totalCoolingInitiatives = coolingInitiatives.length;
    const activeCoolingInitiatives = coolingInitiatives.filter(
      (c) => c.status === 'Ongoing' || c.status === 'Planned'
    ).length;
    const completedCoolingInitiatives = coolingInitiatives.filter(
      (c) => c.status === 'Completed'
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalHotspots,
        highSeverityHotspots,
        mediumSeverityHotspots,
        lowSeverityHotspots,
        avgTemperature: Number(avgTemp),
        avgGreenCover: Number(avgGreenCover),
        activeWeatherStations,
        totalWeatherStations,
        totalCoolingInitiatives,
        activeCoolingInitiatives,
        completedCoolingInitiatives,
        hotspots,
        greenCovers,
        weatherStations,
        coolingInitiatives,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download CSV report of environmental data
// @route   GET /api/reports/download-csv
const downloadCsvReport = async (req, res) => {
  try {
    const [hotspots, greenCovers, weatherStations, coolingInitiatives] = await Promise.all([
      Hotspot.find(),
      GreenCover.find(),
      WeatherStation.find(),
      CoolingInitiative.find(),
    ]);

    let csv = '=== URBAN HEAT MONITORING & COOLING PLATFORM REPORT ===\n';
    csv += `Generated Date,${new Date().toISOString()}\n\n`;

    // Hotspots Section
    csv += '--- HEAT HOTSPOTS ---\n';
    csv += 'Location,Temperature (°C),Severity,Date,Latitude,Longitude\n';
    hotspots.forEach((h) => {
      const d = h.date ? new Date(h.date).toISOString().split('T')[0] : '';
      csv += `"${h.location}",${h.temperature},${h.severity},${d},${h.latitude},${h.longitude}\n`;
    });
    csv += '\n';

    // Green Cover Section
    csv += '--- GREEN COVER ---\n';
    csv += 'Location,Green Cover %,Trees Count,Status\n';
    greenCovers.forEach((g) => {
      csv += `"${g.location}",${g.greenCoverPercentage}%,${g.numberOfTrees},${g.status}\n`;
    });
    csv += '\n';

    // Weather Stations Section
    csv += '--- WEATHER STATIONS ---\n';
    csv += 'Station Name,Location,Temperature (°C),Humidity (%),Status\n';
    weatherStations.forEach((w) => {
      csv += `"${w.stationName}","${w.location}",${w.temperature},${w.humidity}%,${w.status}\n`;
    });
    csv += '\n';

    // Cooling Initiatives Section
    csv += '--- COOLING INITIATIVES ---\n';
    csv += 'Initiative Name,Location,Type,Status,Start Date\n';
    coolingInitiatives.forEach((c) => {
      const sd = c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '';
      csv += `"${c.initiativeName}","${c.location}","${c.type}",${c.status},${sd}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="urban_heat_report_${Date.now()}.csv"`
    );
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReportSummary,
  downloadCsvReport,
};
