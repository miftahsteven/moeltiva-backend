import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';

// Path to the service account JSON
const KEY_PATH = path.resolve(__dirname, '../../../backend-panel/golden-toolbox-402704-df5aca509a50.json');
const PROPERTY_ID = process.env.GA_PROPERTY_ID || '';

const analyticsClient = new BetaAnalyticsDataClient({
  keyFilename: KEY_PATH,
});

export const getVisitorStats = async () => {
  if (!PROPERTY_ID) return { error: 'GA_PROPERTY_ID not configured' };

  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
        {
          name: 'screenPageViews',
        },
      ],
    });

    return response;
  } catch (error) {
    console.error('GA Error:', error);
    throw error;
  }
};

export const getRealtimeStats = async () => {
  if (!PROPERTY_ID) return { error: 'GA_PROPERTY_ID not configured' };

  try {
    const [response] = await analyticsClient.runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    return response;
  } catch (error) {
    console.error('GA Realtime Error:', error);
    throw error;
  }
};
