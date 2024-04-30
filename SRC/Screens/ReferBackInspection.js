import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native';
import {COLOR} from '../Constant/color';
import CustomAlert from '../Component/Modal/AlertModal';
import {FlatList} from 'react-native';
import {fetchReferBAckInspectionAPi} from '../Api/fetchReferBackInspection';
import {useNavigation} from '@react-navigation/native';
import {url} from '../Api/ApiEndpoint';
import CustomLoader from '../Component/Modal/Loader';
import {getData} from '../Utils/localStorageData';
import {IconClose1} from '../Constant/ImageConstant';

export const ReferBackInspection = () => {
  const [isErrorVisible, setisErrorVisible] = useState(false);
  const [pendingproposal, setpendingproposal] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [noRecordsFound, setNoRecordsFound] = useState(false);

  const navigation = useNavigation();
  const [ErrorMessage, setErrorMessage] = useState('');
  const toggleErrorAlert = () => {
    setisErrorVisible(!isErrorVisible);
  };

  const getLocalData = async () => {
    const localdata = await getData('loggedInUser');
    if (localdata) {
      fetchData(localdata);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  const fetchData = async prop => {
    setisLoading(true);
    const data = {
      id: prop?.pos_login_data?.id,
      business_id: prop?.pos_login_data?.business_id,
    };
    const res = await fetchReferBAckInspectionAPi(data);
    if (res.status) {
      setpendingproposal(res.data);
    } else {
      setisErrorVisible(true);
      setErrorMessage(res?.message ?? 'Data Fetch Failed Try Again Later');
    }
    setisLoading(false);
  };

  useEffect(() => {
    getLocalData();
  }, []);

  const renderProposalItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ShowProposalInfo', {
          Item: item,
          path: 'referBack',
        })
      }
      activeOpacity={1}
      style={styles.optionCard}>
      <View style={{flex: 0.35}}>
        <Image
          style={{alignSelf: 'center', height: 62, width: 102}}
          source={{
            uri: `${url}assets/front/img/partners-logos/${item?.logo_name}`,
          }}
        />
      </View>
      <View style={{flex: 0.65}}>
        <Text style={styles.label}>Prop No : {item?.proposal_no}</Text>
        <Text style={styles.label}>Reg No : {item?.vehicle_reg_no}</Text>
        <Text style={styles.label}>IC Name : {item?.ic_name}</Text>
      </View>
    </TouchableOpacity>
  );

  // Filter the proposal items based on the search query
  const filteredProposal = pendingproposal.filter(
    item =>
      item?.vehicle_reg_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.proposal_no.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (filteredProposal.length === 0 && searchQuery !== '') {
      setNoRecordsFound(true);
    } else {
      setNoRecordsFound(false);
    }
  }, [filteredProposal, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <CustomLoader visible={isLoading} />
      <CustomAlert
        visible={isErrorVisible}
        message={ErrorMessage}
        onClose={toggleErrorAlert}
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Vehicle No ,Proposal No "
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
          placeholderTextColor={'#6d6d6d'}
          accessibilityLabel="Search Input"
        />
        {searchQuery !== '' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearch}
            accessibilityLabel="Clear Search">
            <Image style={{height: 22, width: 22}} source={IconClose1} />
          </TouchableOpacity>
        )}
      </View>

      {noRecordsFound && (
        <Text style={styles.noRecordsText} accessibilityLabel="No Record Found">
          No Records Found
        </Text>
      )}

      <FlatList
        accessibilityLabel="Proposal List"
        data={filteredProposal}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProposalItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: COLOR.BACKGROUND_COLOR, flex: 1},
  optionCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    height: 110,
    flexDirection: 'row',
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  label: {color: COLOR.TEXT_COLOR, fontWeight: '500', margin: 2},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 12,
    borderWidth: 1,
    borderColor: '#6d6d6d', // Border color added
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    color: 'black',
  },
  clearButton: {
    padding: 8,
  },
  noRecordsText: {
    alignSelf: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'red',
  },
});
