import RNFS from 'react-native-fs';

export const convertImageToBase64 = async filePath => {
  try {
    // Read the file
    const imageFile = await RNFS.readFile(filePath, 'base64');

    // imageFile is now a base64 encoded string
    return imageFile;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};
