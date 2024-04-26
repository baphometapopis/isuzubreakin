import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    const data = {
      value: value,
      timestamp: new Date().getTime(), // Adding current timestamp
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log('Data stored successfully');
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      const data = JSON.parse(jsonValue);
      const currentTime = new Date().getTime();
      const storedTime = data.timestamp;
      // Check if data is older than 2 days (2 days = 2 * 24 * 60 * 60 * 1000 milliseconds)
      if (currentTime - storedTime > 2 * 24 * 60 * 60 * 1000) {
        // Data is older than 2 days, remove it
        await AsyncStorage.removeItem(key);
        console.log('Data removed due to expiration');
        return null;
      } else {
        console.log('Data retrieved successfully');
        return data.value;
      }
    } else {
      console.log('No data found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};
