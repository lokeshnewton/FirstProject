import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,

  FlatList,
  Modal, PermissionsAndroid
} from 'react-native';

import { connect } from "react-redux";
import { scale } from 'react-native-size-matters';
import { LogoSpinner } from "@components";

import { Images, styles, Color } from "@common";
import { StackActions } from 'react-navigation';
import { KeyboardAwareScrollView, KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import moment from 'moment';

import Checkbox from 'react-native-modest-checkbox'
import DatePicker from 'react-native-datepicker'
import { validate_email, validate_lat, validate_log } from '../../Omni';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import PickerBox from 'react-native-picker-box';
import { CustomPicker } from 'react-native-custom-picker'
import RNPickerSelect from 'react-native-picker-select';


class ModuleGenerateScreen extends Component {



  static propTypes = {
    module_type: PropTypes.string,
    module_name: PropTypes.string,

    convert_leads: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    account_name: PropTypes.string,

  };

  static defaultProps = {
    module_type: '',
    module_name: '',
    convert_leads: '',
    first_name: '',
    last_name: '',
    account_name: ''
  };


  constructor(props) {
    super(props);
    this.state = {
      edit_text: '',
      list_data: [],
      selected: "",
      ModalVisibleStatus: false,
      EmailModalStatus: false,
      FlatListItems: [],
      email_text: '',
      arrayType: [],
      email_index: 0,
      email_text_index: null,
      isFocused: false,
      singleFile: '',
      arrayEmail: [],
      relate_name: '',

      file_path: '',
      file_name: ''



    }

    this.jsonArray2 = [],
      this.my_array = [],
      this.offset = 0
  }



  componentDidMount() {

    this._subscribe = this.props.navigation.addListener('didFocus', () => {

      this.hit_module_generate_api();


    })

  }

  componentWillUnmount() {
    this._subscribe && this._subscribe.remove();
  }


  componentDidUpdate(prevProps) {

    if (this.props.module_type !== prevProps.module_type) {
      this.hit_module_generate_api();
    }

    if (this.props.list != prevProps.list) {
      setTimeout(() => { this.set_list() }, 100)
    }

    const { saveStatus, module_name, module_type, convert_leads, contacts_id, accounts_id } = this.props

    if (saveStatus != '') {



      if (convert_leads == "convert_leads") {
        if (module_name == "Accounts") {

          accounts_id(saveStatus.id)
          this.props.navigation.navigate("ConvertLead")
        }
        if (module_name == "Contacts") {
          contacts_id(saveStatus.id)
          this.props.navigation.navigate("ConvertLead")
        }

      } else {
        const replaceAction = StackActions.replace({
          routeName: 'ModuleDetails',
          params: {
            user_id: saveStatus.id,
            module_type: module_type,
            module_name: module_name
          },
        });

        this.props.navigation.dispatch(replaceAction);
      }


    }


    if (this.props.error != prevProps.error) {
      // console.log('session expire',error)

      if (this.props.error == "Invalid Session ID") {

        this.props.navigation.navigate("LoginScreen")
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    if (prevState.module_name !== nextProps.module_name) {
      return {
        selected: nextProps.module_name,

      };

    }

    // Return null if the state hasn't changed
    return null;
  }

  set_list() {
    const { list, first_name, last_name, account_name } = this.props
    this.jsonArray2 = []

    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {

        var dropdown_value = []

        if (list[i].dropdown != null) {

          var nameArr = list[i].dropdown

          if (list[i].type == "parent") {
            for (let [key, value] of Object.entries(nameArr)) {
              console.log(`${key}: ${value}`);
              dropdown_value.push({
                'value': key,
                'label': value.toString()
              })


            }
          } else {
            for (var j = 0; j < nameArr.length; j++) {
              dropdown_value.push({
                value: nameArr[j],
                label: nameArr[j].toString(),
              })
            }
          }

        }
        //   console.log(dropdown_value);
        var name_value = ""
        if (list[i].name == "first_name" && first_name != "NO-ID") {
          name_value = first_name
        } else

          if (list[i].name == "last_name" && first_name != "NO-ID") {
            name_value = last_name
          } else

            if (list[i].name == "name" && account_name != "NO-ID") {
              name_value = account_name
            } else

              if (list[i].name == "date_start") {
                name_value = moment().format("YYYY-MM-DD HH:mm:ss")
              } else

                if (list[i].name == "date_end") {
                  name_value = moment().add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss")
                }
                
                else

                if (list[i].name == "assigned_user_name") {
                  name_value = list[i].value
                }
                else {
                  name_value = ""
                }

        var module_value

        if (list[i].type == "parent") {

          if (dropdown_value.length > 0)
            module_value = dropdown_value[0].value
        }
        else {
          module_value = list[i].module
        }





        this.jsonArray2.push({
          label: list[i].label,
          id_name: list[i].id_name,
          type: list[i].type,
          db_key: list[i].name,
          dropdown: dropdown_value,
          module: module_value,
          value: name_value,
          relate_id: list[i].name == 'assigned_user_name' ? list[i].related : "",
          required: list[i].required,
          address_form: list[i].type == 'address' ? list[i].address_form : ""
        })


      }
    }
    console.log(
      "final json", JSON.stringify(this.jsonArray2)
    )


    this.setState({ list_data: this.jsonArray2 })
  }

  handle_SavePress() {

    var arr = this.jsonArray2
    var validation = false;

    for (var j = 0; j < arr.length && validation == false; j++) {

      if (arr[j].required == 1) {

        if (arr[j].value.toString().trim() == "") {

          alert("Please Enter " + arr[j].label)

          validation = true;
        }

        else if (arr[j].db_key == "date_start" && arr[j].value != '') {

          var start_date = arr[j].value.split(" ");

          var CurrentDate = new Date();
          start_date = new Date(start_date[0]);

          if (start_date.setHours(0, 0, 0, 0) >= CurrentDate.setHours(0, 0, 0, 0)) {
            // alert('Given date is greater than the current date.');
          } else {
            alert('Start date must be greater than or equal today date');
            validation = true
          }


        }

      } else if (arr[j].db_key == "date_end" && arr[j].value != '') {

        var end_date = arr[j].value.split(" ");
        end_date = new Date(end_date[0]);
        //  alert(start_date)
        if (end_date.setHours(0, 0, 0, 0) >= start_date.setHours(0, 0, 0, 0)) {
          // alert('Given date is greater than the current date.');
        } else {
          alert('End date must be greater than or equal Start date');
          validation = true
        }
      }
      else if (arr[j].db_key == "jjwg_maps_lat_c") {
        if (arr[j].value != '') {

          if (!validate_lat(arr[j].value)) {

            alert('Enter Valid Latitude');
            validation = true
          }
        }

      }
      else if (arr[j].db_key == "jjwg_maps_lng_c") {
        if (arr[j].value != '') {

          if (!validate_log(arr[j].value)) {
            alert('Enter Valid Longitude');
            validation = true
          }
        }

      }
    }

    if (!validation) {
      this.hit_save_api(arr)
    }
  }

  hit_save_api(arr) {
    var obj = []

    for (var i = 0; i < arr.length; i++) {


      if (arr[i].type == "address") {
        var add = arr[i].address_form
        for (var j = 0; j < add.length; j++) {
          obj.push({
            name: add[j].name,
            value: add[j].value,
          })
        }
      } else
        if (arr[i].type == "relate") {

          obj.push({
            name: arr[i].db_key,
            value: arr[i].value,
          })

          obj.push({
            name: arr[i].id_name,
            value: arr[i].relate_id,
          })

        } else

          if (arr[i].type == "parent") {

            obj.push({
              name: "parent_type",
              value: arr[i].module,
            })

            obj.push({
              name: arr[i].db_key,
              value: arr[i].value,
            })

            obj.push({
              name: arr[i].id_name,
              value: arr[i].relate_id,
            })

          }
          else {
            obj.push({
              name: arr[i].db_key,
              value: arr[i].value,
            })
          }


    }


    console.log("handle save", JSON.stringify(this.jsonArray2))

    console.log("convert array", JSON.stringify(obj))

    if (obj.length > 0) {

      const { session_id, fetchSaveForm, fetchSaveDoc, fetchSaveNote, navigation, module_type } = this.props;

      if (session_id) {

        if (module_type == "Documents") {
          fetchSaveDoc(session_id, obj, this.state.file_path, this.state.file_name);
        }
        else if (module_type == "Notes") {
          fetchSaveNote(session_id, obj, this.state.file_path, this.state.file_name);
        }

        else {

          fetchSaveForm(session_id, module_type, obj, navigation);
        }


      }

    }
  }


  hit_module_generate_api = () => {

    const { session_id, fetchGenerateForm, module_type } = this.props;

    if (session_id) {
      fetchGenerateForm(session_id, module_type, "edit");
    }
  }



  onDateChange(text, index) {
    for (var i = 0; i < this.jsonArray2.length; i++) {

      if (this.jsonArray2[i].db_key == "date_end") {
        this.jsonArray2[i].value = text;
      }
    }

    this.jsonArray2[index].value = text;
    this.setState({ list_data: this.jsonArray2 })
  }


  onInputChange(text, index) {

    this.jsonArray2[index].value = text.trimStart();
    this.setState({ list_data: this.jsonArray2 })

    // console.log("update json array value",JSON.stringify(this.jsonArray2))
  }

  onAddressChange(text, index, ch_index) {

    this.jsonArray2[index].address_form[ch_index].value = text.trimStart();
    this.setState({ list_data: this.jsonArray2 })

    // console.log("update json array value",JSON.stringify(this.jsonArray2))
  }


  _handleReset(index) {
    this.jsonArray2[index].value = "";
    this.jsonArray2[index].relate_id = "";
    this.setState({ list_data: this.jsonArray2 })
  }

  _handlePickReset(index) {
    this.jsonArray2[index].value = "";
    this.setState({
      list_data: this.jsonArray2,
      file_path: "",
      file_name: ""
    })
  }

  setDropdown(text, index) {



    if (this.jsonArray2[index].type != "parent") {
      this.jsonArray2[index].value = text
    } else {
      this.jsonArray2[index].module = text
      this.jsonArray2[index].value = ""
      this.jsonArray2[index].relate_id = ""
    }



    this.setState({ list_data: this.jsonArray2 })
  }

  _handleRelate = (item, index) => {
    console.log("relate", item)


    var title = item;
    var arr = this.jsonArray2[index].dropdown
    if (this.jsonArray2[index].type == "parent") {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].value == item) {
          title = arr[i].label
        }
      }

    }

    const { fetchRelateModule, session_id, isFetching } = this.props

    fetchRelateModule(session_id, item)


    if (!isFetching)
      setTimeout(() => {
        this.setState({
          ModalVisibleStatus: true,
          relate_index: index,
          relate_name: title
        });


      }
        , 100)



  }

  onCheckbox(ch, i) {

    //console.log(checked)
    if (ch.checked) {
      this.jsonArray2[i].value = 1;

    } else {
      this.jsonArray2[i].value = 0;

    }
    this.setState({ list_data: this.jsonArray2 })

  }


  ShowModalFunction(visible) {

    this.setState({ ModalVisibleStatus: visible });

  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.renderItem1}>
        <View style={styles.renderItem2}>
          <Text>
            {item.key}
          </Text>

        </View>
      </View>
    )
  }


  FlatListItemSeparator = () => {
    return (
      <View style={styles.flatlistView} />
    );
  }

  _listEmptyComponent = () => {
    return (
      <View style={styles.listEmpView}>
        <Text style={styles.listEmpText}>No Data Found</Text>
      </View>
    )
  }

  _handleRelateModal(item, id) {

    this.ShowModalFunction(!this.state.ModalVisibleStatus)

    this.jsonArray2[this.state.relate_index].value = item;
    this.jsonArray2[this.state.relate_index].relate_id = id;

    console.log("update json array value", JSON.stringify(this.jsonArray2))
    this.setState({ list_data: this.jsonArray2 })

  }

  handleFocus = () => { this.setState({ isFocused: true }) }


  handleBlur = (email_text_index) => {

    this.setState({ isFocused: false })
    const { email_text, arrayEmail } = this.state
    var obj = [];
    obj = arrayEmail;

    if (email_text == '') {
      this.setState({

        email_text: ''
      })

      alert('Enter Email')

    } else if (validate_email(email_text) === false) {
      alert('Invalid Email')
      this.setState({
        email_text: ''
      })

    } else {

      if (arrayEmail.length == 0) {
        obj.push({
          "email_id": email_text,
          "type": "primary",
          "Primary": "1",
          "reply": "0",
          "invalid": "0",
          "opt_out": "0",
          "opt_in": "1"
        })
      } else if (arrayEmail.length > 0) {
        obj.push({
          "email_id": email_text,
          "type": "opt_in",
          "Primary": "0",
          "reply": "0",
          "invalid": "0",
          "opt_out": "0",
          "opt_in": "1"
        })
      }

      this.setState({
        arrayEmail: obj,
        email_text: ''
      })

    }

    this.jsonArray2[email_text_index].value = arrayEmail;
    this.setState({ list_data: this.jsonArray2 })
    console.log("handle blure", JSON.stringify(this.jsonArray2))
  }


  _handleAddEmail(email_text_index) {
    const { email_text, arrayEmail } = this.state

    var obj = [];
    obj = arrayEmail;


    if (email_text == "") {
      alert('Enter Email')
    } else if (validate_email(email_text) === false) {
      alert('Invalid Email')


    } else {

      if (arrayEmail.length == 0) {
        obj.push({
          "email_id": email_text,
          "type": "primary",
          "Primary": "1",
          "reply": "0",
          "invalid": "0",
          "opt_out": "0",
          "opt_in": "1"
        })
      } else if (arrayEmail.length > 0) {
        obj.push({
          "email_id": email_text,
          "type": "opt_in",
          "Primary": "0",
          "reply": "0",
          "invalid": "0",
          "opt_out": "0",
          "opt_in": "1"
        })
      }

      this.setState({
        arrayEmail: obj,
        email_text: '',
      })


    }



    this.jsonArray2[email_text_index].value = arrayEmail;
    this.setState({ list_data: this.jsonArray2 })
    console.log("update json array value", JSON.stringify(this.jsonArray2))

    console.log("email_json", JSON.stringify(arrayEmail))


  }

  _handleEmailModal(select_option) {

    const { email_index, arrayEmail, email_text_index } = this.state

    var obj = arrayEmail;
    if (select_option == 'remove') {
      obj.splice(email_index, 1)
    } else {


      console.log(select_option)


      if (select_option == "primary") {

        for (var i = 0; i < obj.length; i++) {
          if (i == email_index) {

            obj[email_index].type = "primary"
            obj[email_index].Primary = "1"
            obj[email_index].reply = "0"
            obj[email_index].invalid = "0"
            obj[email_index].opt_out = "0"
            obj[email_index].opt_in = "1"
          } else {

            if (obj[i].opt_out == "1") {
              obj[i].type = "opt_out"
              obj[i].Primary = "0"
            } else {

              obj[i].type = "opt_in"
              obj[i].Primary = "0"
            }
          }
        }

      } else

        if (obj[email_index].type == "primary") {

          if (select_option == "opt_out") {

            obj[email_index].opt_out = "1"
            obj[email_index].opt_in = "0"
            //alert(select_option)

          }
          else if (select_option == "opt_in") {

            obj[email_index].opt_out = "0"
            obj[email_index].opt_in = "1"
            //alert(select_option)

          } else if (select_option == "invalid") {


            obj[email_index].reply = "0"
            obj[email_index].invalid = "1"
            // alert(select_option)

          }

          else if (select_option == "reply") {


            obj[email_index].reply = "0"
            obj[email_index].invalid = "0"
            // alert(select_option)

          }

        } else {
          if (select_option == "opt_out") {

            obj[email_index].type = "opt_out"
            obj[email_index].opt_out = "1"
            obj[email_index].opt_in = "0"


          } else if (select_option == "opt_in") {
            obj[email_index].type = "opt_in"
            obj[email_index].opt_out = "0"
            obj[email_index].opt_in = "1"
          }
          else if (select_option == "invalid") {


            obj[email_index].reply = "0"
            obj[email_index].invalid = "1"
            // alert(select_option)

          }
          else if (select_option == "reply") {


            obj[email_index].reply = "0"
            obj[email_index].invalid = "0"
            // alert(select_option)

          }
        }




    }



    this.jsonArray2[email_text_index].value = obj;

    this.setState({
      EmailModalStatus: false,
      arrayEmail: obj,
      list_data: this.jsonArray2
    })

    console.log('handleEmail', obj)


    console.log("update json array value", email_text_index, JSON.stringify(this.jsonArray2))

  }


  _handleEmailSquare(index) {
    const { arrayEmail } = this.state
    var arr = arrayEmail;
    var option = []

    // "type": "opt_in",
    // "Primary":"0",
    // "reply":"0",
    // "invalid":"0",
    // "opt_out":"0",
    // "opt_in":"1"


    if (arr[index].type == "primary") {


      if (arr[index].opt_out == "0"
        && arr[index].opt_in == "1"
        && arr[index].invalid == "0"
        && arr[index].reply == "0"
      ) {


        option = [
          {
            email_type: "opt_out",
            label: 'Opt-Out'
          },

          {
            email_type: "invalid",
            label: 'Invalid'
          },

          {
            email_type: "remove",
            label: 'Remove'
          },
        ]
      }

      else if (arr[index].opt_out == "1"
        && arr[index].opt_in == "0"
        && arr[index].reply == "0"
        && arr[index].invalid == "0") {
        option = [
          {
            email_type: "opt_in",
            label: 'Opt-In'
          },

          {
            email_type: "invalid",
            label: 'Invalid'
          },

          {
            email_type: "remove",
            label: 'Remove'
          },
        ]
      }
      else if (arr[index].opt_out == "0"
        && arr[index].opt_in == "1"
        && arr[index].reply == "0"
        && arr[index].invalid == "1") {
        option = [
          {
            email_type: "opt_out",
            label: 'Opt-Out'
          },

          {
            email_type: "reply",
            label: 'Valid'
          },

          {
            email_type: "remove",
            label: 'Remove'
          },
        ]
      }
      else if (arr[index].opt_out == "0"
        && arr[index].opt_in == "1"
        && arr[index].reply == "0"
        && arr[index].invalid == "0") {
        option = [
          {
            email_type: "opt_out",
            label: 'Opt-Out'
          },

          {
            email_type: "invalid",
            label: 'Invalid'
          },

          {
            email_type: "remove",
            label: 'Remove'
          },
        ]
      }


      else if (arr[index].opt_out == "1"
        && arr[index].opt_in == "0"
        && arr[index].reply == "0"
        && arr[index].invalid == "1") {
        option = [
          {
            email_type: "opt_in",
            label: 'Opt-In'
          },

          {
            email_type: "reply",
            label: 'Valid'
          },

          {
            email_type: "remove",
            label: 'Remove'
          },
        ]
      }




    } else {


      if (arr[index].opt_out == "0"
        && arr[index].opt_in == "1"
        && arr[index].invalid == "0"
        && arr[index].reply == "0"
      ) {
        option = [
          {
            email_type: "primary",
            label: 'Primary'
          },

          {
            email_type: "opt_out",
            label: 'Opt_Out'
          },
          {
            email_type: "invalid",
            label: 'invalid'
          },
          {
            email_type: "remove",
            label: 'Remove'
          },
        ]
      } else
        if (arr[index].opt_out == "1"
          && arr[index].opt_in == "0"
          && arr[index].invalid == "0"
          && arr[index].reply == "0"
        ) {
          option = [
            {
              email_type: "primary",
              label: 'Primary'
            },

            {
              email_type: "opt_in",
              label: 'Opt_In'
            },
            {
              email_type: "invalid",
              label: 'invalid'
            },
            {
              email_type: "remove",
              label: 'Remove'
            },
          ]
        }
        else
          if (arr[index].opt_out == "0"
            && arr[index].opt_in == "1"
            && arr[index].invalid == "0"
            && arr[index].reply == "0"
          ) {
            option = [
              {
                email_type: "primary",
                label: 'Primary'
              },

              {
                email_type: "opt_out",
                label: 'Opt_Out'
              },
              {
                email_type: "invalid",
                label: 'invalid'
              },
              {
                email_type: "remove",
                label: 'Remove'
              },
            ]
          }

          else
            if (arr[index].opt_out == "0"
              && arr[index].opt_in == "1"
              && arr[index].invalid == "1"
              && arr[index].reply == "0"
            ) {
              option = [
                {
                  email_type: "primary",
                  label: 'Primary'
                },

                {
                  email_type: "opt_out",
                  label: 'Opt_Out'
                },
                {
                  email_type: "reply",
                  label: 'Valid'
                },
                {
                  email_type: "remove",
                  label: 'Remove'
                },
              ]
            }

            else
              if (arr[index].opt_out == "0"
                && arr[index].opt_in == "1"
                && arr[index].invalid == "0"
                && arr[index].reply == "0"
              ) {
                option = [
                  {
                    email_type: "primary",
                    label: 'Primary'
                  },

                  {
                    email_type: "opt_out",
                    label: 'Opt_Out'
                  },
                  {
                    email_type: "invalid",
                    label: 'InValid'
                  },
                  {
                    email_type: "remove",
                    label: 'Remove'
                  },
                ]
              }

              else
                if (arr[index].opt_out == "1"
                  && arr[index].opt_in == "0"
                  && arr[index].invalid == "1"
                  && arr[index].reply == "0"
                ) {
                  option = [
                    {
                      email_type: "primary",
                      label: 'Primary'
                    },

                    {
                      email_type: "opt_in",
                      label: 'Opt_In'
                    },
                    {
                      email_type: "reply",
                      label: 'Valid'
                    },
                    {
                      email_type: "remove",
                      label: 'Remove'
                    },
                  ]
                }


    }



    this.setState({
      email_index: index,
      EmailModalStatus: true,
      arrayType: option
    })
  }


  //image picker
  chooseFile = (index) => {

    if (this.props.module_type != "Notes") {

      var options = {
        title: 'Select Image',
        customButtons: [
          { name: 'customOptionKey', title: 'Open Recent Files' },
        ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.showImagePicker(options, response => {
        console.log('Response = ', response);
        console.log("image_index", index)

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          // alert(response.customButton);
          this.requestRunTimePermission(index)
          // this._showFilePicker(index);
        } else {
          let source = response;
          console.log('source : ' + JSON.stringify(source));
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.jsonArray2[index].value = source.fileName
          this.setState({
            list_data: this.jsonArray2,
            file_path: source.data,
            file_name: source.fileName

          })
        }
      });

    } else {
      this.requestRunTimePermission(index)
    }


  };
  //permission
  requestRunTimePermission = (index) => {
    var that = this;
    async function externalStoragePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data.',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          that._showFilePicker(index);
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        Alert.alert('Write permission err', err);
        console.warn(err);
      }
    }

    if (Platform.OS === 'android') {
      externalStoragePermission();
    } else {
      this._showFilePicker(index);
    }
  }

  //filePicker
  async _showFilePicker(index) {
    //Opening Document Picker for selection of one file
    console.log("file_index", index)


    try {
      const res = await DocumentPicker.pick({
        type: [this.props.module_type != "Notes" ?
          DocumentPicker.types.allFiles : DocumentPicker.types.plainText],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });

      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));

      RNFS.readFile(res.uri, 'base64')
        .then(response => {
          console.log("base64", response);

          // var obj = []
          // obj = this.jsonArray2;
          // obj[index].value = res.name
          // this.jsonArray2 = obj
          this.jsonArray2[index].value = res.name
          this.setState({
            list_data: this.jsonArray2,
            file_path: response,
            file_name: res.name
          })


        });



      console.log("filejson", JSON.stringify(this.jsonArray2))


    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        // alert('Canceled from single doc picker');
        console.log(err)
      } else {
        //For Unknown Error
        // alert('Unknown Error: ' + JSON.stringify(err));
        console.log(err)
        throw err;
      }
    }



  }




  _headerRender() {
    return (
      <View>
        <View style={styles.headView1}>
          <View style={styles.headView2}>

            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}>

              <View style={styles.headView3}>

                <Image source={Images.cancelIcon} style={styles.headImg1} />
                <Text style={styles.headText1}
                  numberOfLines={1}
                >Cancel</Text>

              </View>

            </TouchableOpacity>

          </View>

          <View style={styles.headView4}>
            <Text style={styles.headText2}
              numberOfLines={2}
            >Create {this.state.selected}</Text>
          </View>

          <View style={styles.headView5}>
            <TouchableOpacity
              onPress={this.handle_SavePress.bind(this)}>

              <View style={styles.headView6}>
                <Image source={Images.saveIcon} style={styles.headImg2} />
                <Text style={styles.headText3}
                  numberOfLines={1}>Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headView7} />
      </View>
    )
  }

  _assignRender() {
    const { isFetching, module_name, relate_list } = this.props
    return (
      <Modal
        transparent={true}
        animationType={"none"}
        visible={this.state.ModalVisibleStatus}
        onRequestClose={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }} >

        <View style={styles.assignContainer}>

          <View style={styles.assignView1}>



            <Text style={styles.assignText1}>Select {this.state.relate_name}</Text>
            <View style={styles.assignView2} />

            <FlatList
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              data={relate_list}
              ListEmptyComponent={this._listEmptyComponent}
              renderItem={({ item, index }) =>

                <TouchableOpacity
                  onPress={this._handleRelateModal.bind(this, item.name_value_list.name.value, item.id)}>

                  <View style={styles.assignView3}>

                    <Text style={styles.assignText2}
                      numberOfLines={1}
                    >{item.name_value_list.name.value}</Text>

                    {item.name_value_list.hasOwnProperty("title") ?
                      <Text style={styles.assignText3}
                        numberOfLines={1}
                      >{item.name_value_list.title.value}</Text> : null

                    }

                  </View>

                </TouchableOpacity>

              }
            />
            <View style={{
              height: scale(40), backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <TouchableOpacity onPress={() => {
                this.ShowModalFunction(!this.state.ModalVisibleStatus)
              }}


              >
                <Image
                  source={Images.cancel}
                  style={styles.assignImg1} />
              </TouchableOpacity>
            </View>


          </View>

        </View>
      </Modal>

    )
  }


  _renderAddress(address, i) {

    return <View key={i}>
      <FlatList

        keyExtractor={(item, index) => index.toString()}

        data={address}
        renderItem={({ item, index }) =>
          <View style={{ marginTop: scale(5) }}>

            <Text style={styles.keyScrollText10}
              numberOfLines={1}
            >{item.label}</Text>




            <TextInput
              key={index}
              style={styles.keyScrollTxtInput4}
              underlineColorAndroid='transparent'
              onChangeText={(edit_text) =>
                this.onAddressChange(edit_text, i, index)}
              value={item.value}
            />

          </View>

        }
      />
    </View>
  }

  _emailRender() {
    return (
      <Modal
        transparent={true}
        animationType={"slide"}
        visible={this.state.EmailModalStatus}
        onRequestClose={() => { this.ShowModalFunction(!this.state.EmailModalStatus) }} >

        <View style={styles.emailContainer}>
          <View style={styles.emailView1}>

            <FlatList
              style={styles.emailFlat1}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              data={this.state.arrayType}
              ListEmptyComponent={this._listEmptyComponent}
              renderItem={({ item, index }) =>

                <TouchableOpacity
                  key={index}
                  onPress={this._handleEmailModal.bind(this,
                    item.email_type,
                  )}
                >
                  <View style={styles.emailView2}>
                    <Text style={styles.emailText1}>{item.label}</Text>
                  </View>

                </TouchableOpacity>

              }
            />


            <TouchableOpacity activeOpacity={0.7}
              style={styles.emailTouch1}
              onPress={() => { this.setState({ EmailModalStatus: false }) }}
            >

              <Text style={styles.emailText2}> Cancel </Text>

            </TouchableOpacity>

          </View>


        </View>

      </Modal>
    )
  }


  _onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.offset || 0);

    if (Math.abs(dif) < 3) {
      console.log('unclear');
    } else if (dif < 0) {
      console.log('up');
      Keyboard.dismiss()
    } else {
      console.log('down');
    }

    this.offset = currentOffset;
  };



  _keyboardScrollViewRender() {
    return (

      <KeyboardAwareFlatList

        keyboardVerticalOffset={50}
        innerRef={ref => {
          this.scroll = ref
        }}
        scrollEventThrottle={16}
        onScroll={(e) => this._onScroll(e)}
        contentContainerStyle={{ flexGrow: 1, }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        data={this.state.list_data}
        ListHeaderComponent={this._headerRender()}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        extraHeight={100}
        enableResetScrollToCoords={false}
        extraScrollHeight={100}
        enableOnAndroid={true}
        stickyHeaderIndices={[0]}

        renderItem={({ item, index }) =>
          <View style={{ margin: scale(10), alignItems: 'center' }}>


            {item.type == "text" ?
              <View style={styles.keyScrollView2}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.keyScrollText1}
                    numberOfLines={1}
                  >{item.label}</Text>
                  {
                    item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(22), textAlignVertical: 'center' }}>*</Text> : null
                  }

                </View>


                <View style={styles.keyScrollView3}>

                  <TextInput style={styles.keyScrollTxtInput1}
                    underlineColorAndroid="transparent"
                    placeholder={item.required == 1 ? "Required" : ""}
                    placeholderTextColor="#565656"
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={(edit_text) =>
                      this.onInputChange(edit_text, index)}
                    value={item.value}

                  />
                </View>
              </View>
              :

              item.type == 'phone' ?
                <View style={styles.keyScrollView2}>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.keyScrollText1}
                      numberOfLines={1}
                    >{item.label}</Text>
                    {
                      item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(22), textAlignVertical: 'center' }}>*</Text> : null
                    }

                  </View>


                  <TextInput

                    style={styles.keyScrollTxtInput4}
                    underlineColorAndroid='transparent'
                    onChangeText={(edit_text) =>
                      this.onInputChange(edit_text, index)}
                    keyboardType={"phone-pad"}
                    placeholder={item.required == 1 ? "Required" : ""}
                  />


                </View> :
                item.type == 'int' ?
                  <View style={styles.keyScrollView2}>

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.keyScrollText1}
                        numberOfLines={1}
                      >{item.label}</Text>
                      {
                        item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(22), textAlignVertical: 'center' }}>*</Text> : null
                      }

                    </View>

                    <TextInput

                      style={styles.keyScrollTxtInput4}
                      underlineColorAndroid='transparent'
                      onChangeText={(edit_text) =>
                        this.onInputChange(edit_text, index)}
                      keyboardType={"number-pad"}
                      placeholder={item.required == 1 ? "Required" : ""}
                    />

                  </View> :

                  item.type == 'float' ?
                    <View style={styles.keyScrollView2}>

                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.keyScrollText1}
                          numberOfLines={1}
                        >{item.label}</Text>
                        {
                          item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(22), textAlignVertical: 'center' }}>*</Text> : null
                        }

                      </View>

                      <TextInput

                        style={styles.keyScrollTxtInput4}
                        underlineColorAndroid='transparent'
                        onChangeText={(edit_text) =>
                          this.onInputChange(edit_text, index)}
                        keyboardType={"decimal-pad"}
                        placeholder={item.required == 1 ? "Required" : ""}
                      />

                    </View> :

                    item.type == 'enum' ?
                      <View style={styles.keyScrollView5}>

                        <View style={styles.keyScrollView6}>

                          <View style={{ flexDirection: 'row', marginBottom: scale(5) }}>
                            <Text style={styles.keyScrollText1}
                              numberOfLines={1}
                            >{item.label}</Text>
                            {
                              item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(22), textAlignVertical: 'center' }}>*</Text> : null
                            }

                          </View>

                          <View style={styles.KeyEnumNewView}>
                            <RNPickerSelect
                              placeholder={{
                                label: "Selected Empty",
                                value: "",
                                color: 'grey',
                                fontSize: scale(12),
                                fontWeight: 'bold',
                              }}

                              placeholderTextColor='#565656'
                              items={item.dropdown}
                              onValueChange={value => this.setDropdown(value, index)}
                              style={{
                                inputIOS: styles.inputIOS,
                                inputAndroid: styles.inputAndroid,
                                iconContainer: styles.iconContainer
                              }}

                              value={item.value}
                              useNativeAndroidPickerStyle={false}
                              textInputProps={{ underlineColor: 'yellow' }}
                              Icon={() => {
                                return (
                                  <View
                                    style={styles.triangleStyle}
                                  />
                                );
                              }}
                            />
                          </View>



                        </View>

                      </View> :

                      item.type == 'relate' ?

                        <View style={styles.keyScrollView7}>

                          <View style={styles.keyScrollView8}>

                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.keyScrollText1}
                                numberOfLines={1}
                              >{item.label}</Text>
                              {
                                item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(22), textAlignVertical: 'center' }}>*</Text> : null
                              }

                            </View>

                            <Image
                              source={Images.relations}
                              style={styles.keyScrollImg1}
                              resizeMode={'contain'}
                            />

                          </View>

                          <View style={styles.keyScrollNew}>
                            <TouchableOpacity
                              onPress={this._handleRelate.bind(this, item.module, index)}
                              style={styles.keyScrollTouch1}>

                              <Text style={styles.keyScrollText4}
                                numberOfLines={1}>{item.value}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={this._handleReset.bind(this, index)}>

                              <Image
                                source={Images.reset}
                                style={{
                                  width: scale(15),
                                  height: scale(15)
                                }}
                                resizeMode={'contain'}
                              />
                            </TouchableOpacity>

                          </View>



                        </View> :

                        item.type == 'email' ?

                          <View style={styles.keyScrollemailView1}>
                            <Text style={styles.keyScrollText5}
                            >Email Address</Text>

                            <FlatList style={styles.keyScrollFlat1}
                              data={this.state.arrayEmail}
                              extraData={this.state.arrayEmail}
                              keyExtractor={(item, index) => index.toString()}
                              ItemSeparatorComponent={this.FlatListItemSeparator}
                              renderItem={({ item, index }) =>

                                <View key={index}
                                  style={styles.keyScrollemailView2}
                                //  onPress={this.GetItem.bind(this, item.title)} 

                                >

                                  {
                                    item.type == "primary" ?

                                      <View>
                                        {
                                          item.opt_out == "0" && item.opt_in == "1" && item.reply == "0" && item.invalid == "0" ?
                                            <View style={styles.keyScrollemailView3}>

                                              <Text style={styles.keyScrollemailText1}>
                                                {item.email_id} </Text>

                                              <TouchableOpacity
                                                onPress={this._handleEmailSquare.bind(this, index)}
                                              >
                                                <Image
                                                  source={Images.squaresbox}
                                                  style={styles.keyScrollemailImg1}
                                                  resizeMode={'contain'}
                                                />
                                              </TouchableOpacity>

                                            </View> :
                                            item.opt_out == "1" && item.opt_in == "0" && item.reply == "0" && item.invalid == "0" ?
                                              <View style={styles.keyScrollemailView4}>

                                                <Text style={styles.keyScrollemailText2}>
                                                  {item.email_id} </Text>

                                                <TouchableOpacity
                                                  onPress={this._handleEmailSquare.bind(this, index)}
                                                >
                                                  <Image
                                                    source={Images.squaresbox}
                                                    style={styles.keyScrollemailImg2}
                                                    resizeMode={'contain'}
                                                  />
                                                </TouchableOpacity>

                                              </View> :
                                              item.opt_out == "0" && item.opt_in == "1" && item.reply == "0" && item.invalid == "1" ?
                                                <View style={styles.keyScrollemailView5}>

                                                  <Text style={styles.keyScrollemailText3}>
                                                    {item.email_id} </Text>

                                                  <TouchableOpacity
                                                    onPress={this._handleEmailSquare.bind(this, index)}
                                                  >
                                                    <Image
                                                      source={Images.squaresbox}
                                                      style={styles.keyScrollemailImg3}
                                                      resizeMode={'contain'}
                                                    />
                                                  </TouchableOpacity>

                                                </View> :
                                                item.opt_out == "1" && item.opt_in == "0" && item.reply == "0" && item.invalid == "1" ?
                                                  <View style={styles.keyScrollemailView6}>

                                                    <Text style={styles.keyScrollemailText4}>
                                                      {item.email_id} </Text>

                                                    <TouchableOpacity
                                                      onPress={this._handleEmailSquare.bind(this, index)}
                                                    >
                                                      <Image
                                                        source={Images.squaresbox}
                                                        style={styles.keyScrollemailImg4}
                                                        resizeMode={'contain'}
                                                      />
                                                    </TouchableOpacity>

                                                  </View> : null
                                        }

                                      </View>
                                      : item.opt_out == "0" && item.opt_in == "1" && item.reply == "0" && item.invalid == "0" ?

                                        <View style={styles.keyScrollemailView7}>

                                          <Text style={styles.keyScrollemailText5}>
                                            {item.email_id} </Text>

                                          <TouchableOpacity
                                            onPress={this._handleEmailSquare.bind(this, index)}
                                          >
                                            <Image
                                              source={Images.squaresbox}
                                              style={styles.keyScrollemailImg5}
                                              resizeMode={'contain'}
                                            />
                                          </TouchableOpacity>

                                        </View>

                                        : item.opt_out == "1" && item.opt_in == "0" && item.reply == "0" && item.invalid == "0" ?

                                          <View style={styles.keyScrollemailView8}>

                                            <Text style={styles.keyScrollemailText6}>
                                              {item.email_id}</Text>

                                            <TouchableOpacity
                                              onPress={this._handleEmailSquare.bind(this, index)}
                                            >
                                              <Image
                                                source={Images.squaresbox}
                                                style={styles.keyScrollemailImg6}
                                                resizeMode={'contain'}
                                              />
                                            </TouchableOpacity>

                                          </View>

                                          : item.opt_out == "0" && item.opt_in == "1" && item.reply == "0" && item.invalid == "1" ?

                                            <View style={styles.keyScrollemailView9}>

                                              <Text style={styles.keyScrollemailText7}>
                                                {item.email_id} </Text>

                                              <TouchableOpacity
                                                onPress={this._handleEmailSquare.bind(this, index)}
                                              >
                                                <Image
                                                  source={Images.squaresbox}
                                                  style={styles.keyScrollemailImg7}
                                                  resizeMode={'contain'}
                                                />
                                              </TouchableOpacity>

                                            </View>
                                            : item.opt_out == "1" && item.opt_in == "0" && item.reply == "0" && item.invalid == "1" ?

                                              <View style={styles.keyScrollemailView10}>

                                                <Text style={styles.keyScrollemailText8}>
                                                  {item.email_id}</Text>

                                                <TouchableOpacity
                                                  onPress={this._handleEmailSquare.bind(this, index)}
                                                >
                                                  <Image
                                                    source={Images.squaresbox}
                                                    style={styles.keyScrollemailImg8}
                                                    resizeMode={'contain'}
                                                  />
                                                </TouchableOpacity>

                                              </View> : null

                                  }
                                </View>
                              }
                            />


                            <TouchableOpacity activeOpacity={0.7}
                              style={styles.keyScrollTouch2}
                              onPress={() => this._handleAddEmail(index)}

                            >

                              <Text style={styles.keyScrollText6}>Add Email</Text>

                            </TouchableOpacity>

                            <View>


                              <TextInput
                                style={styles.keyScrollTxtInput3}
                                underlineColorAndroid='transparent'
                                value={this.state.email_text}
                                onChangeText={(email_text) => {
                                  this.setState({
                                    email_text: email_text,
                                    email_text_index: index

                                  })
                                }}
                                onFocus={this.handleFocus}
                                //   onBlur={this.handleBlur.bind(this, index)}
                                placeholder={item.required == 1 ? "Required" : ""}
                                keyboardType='email-address'
                                autoCapitalize="none" autoCorrect={false}

                              />
                            </View>
                          </View> :



                          item.type == 'datetime' ?                // date-time

                            null :

                            item.type == 'datetimecombo' ?                      //datetimecombo

                              <View style={styles.keyScrollView10}>
                                <View style={{ flexDirection: 'row' }}>
                                  <Text style={styles.keyScrollText7}
                                    numberOfLines={1}
                                  >{item.label}</Text>
                                  {
                                    item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(18), textAlignVertical: 'center' }}> *</Text> : null
                                  }

                                </View>


                                <DatePicker
                                  style={{ width: scale(200), marginTop: scale(10) }}
                                  date={item.value}
                                  placeholder="Select DateTime"
                                  mode="datetime"
                                  format="YYYY-MM-DD HH:mm:ss"
                                  confirmBtnText="Confirm"
                                  cancelBtnText="Cancel"
                                  customStyles={{
                                    dateIcon: {
                                      position: 'absolute',
                                      left: scale(0),
                                      top: scale(4),
                                      marginLeft: scale(0)
                                    },
                                    dateInput: {
                                      marginLeft: scale(36),

                                    },
                                    placeholderText: {
                                      color: '#565656'
                                    }
                                  }}
                                  minuteInterval={10}
                                  onDateChange={(datetime) => {

                                    this.onDateChange(datetime, index)
                                  }
                                  }
                                />

                              </View> :

                              item.type == 'date' ?                      //date

                                <View style={styles.keyScrollView10}>

                                  <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.keyScrollText7}
                                      numberOfLines={1}
                                    >{item.label}</Text>
                                    {
                                      item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(18), textAlignVertical: 'center' }}> *</Text> : null
                                    }

                                  </View>


                                  <DatePicker
                                    style={{ width: 200, margin: scale(10) }}
                                    date={item.value}
                                    placeholder="Select Date"
                                    mode="date"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                      dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                      },
                                      dateInput: {
                                        marginLeft: 36
                                      },
                                      placeholderText: {
                                        color: '#565656'
                                      }
                                    }}
                                    minuteInterval={10}
                                    onDateChange={(date) => {

                                      this.onDateChange(date, index)
                                    }
                                    }
                                  />

                                </View> :

                                item.type == 'file' ?
                                  //File

                                  <View style={styles.keyScrollView11}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.keyScrollText1}
                                          numberOfLines={1}
                                        >{item.label}</Text>
                                        {
                                          item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(18), textAlignVertical: 'center' }}> *</Text> : null
                                        }
                                      </View>

                                      <Image
                                        source={Images.file}
                                        style={styles.keyScrollImg1}
                                        resizeMode={'contain'}
                                      />

                                    </View>

                                    <View style={styles.keyScrollNew}>

                                      <TouchableOpacity
                                        onPress={this.chooseFile.bind(this, index)}
                                        style={styles.keyScrollTouch1}>



                                        <Text style={styles.keyScrollText4}
                                          numberOfLines={1}
                                        >{item.value}</Text>
                                      </TouchableOpacity>

                                      <TouchableOpacity
                                        onPress={this._handlePickReset.bind(this, index)}>

                                        <Image
                                          source={Images.reset}
                                          style={{
                                            width: scale(15),
                                            height: scale(15)
                                          }}
                                          resizeMode={'contain'}
                                        />
                                      </TouchableOpacity>

                                    </View>

                                  </View>
                                  :

                                  item.type == 'url' ?
                                    <View style={styles.keyScrollView12}>

                                      <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.keyScrollText10}
                                          numberOfLines={1}
                                        >{item.label}</Text>
                                        {
                                          item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(18), textAlignVertical: 'center' }}> *</Text> : null
                                        }

                                      </View>
                                      <TextInput
                                        key={index}
                                        style={styles.keyScrollTxtInput4}
                                        placeholder={item.required == 1 ? 'Required' : ''}
                                        placeholderTextColor="#565656"
                                        underlineColorAndroid="transparent"
                                        onChangeText={edit_text =>
                                          this.onInputChange(edit_text, index)
                                        }
                                        value={item.value}
                                      />
                                      <Text style={{ fontSize: scale(10), color: '#565656', marginLeft: scale(5) }}>hint: https://www.example.com </Text>
                                      <Text style={{ fontSize: scale(10), color: '#565656', marginLeft: scale(5) }}>hint: http://www.example.com </Text>
                                    </View> :

                                    item.type == 'bool' ?
                                      <View style={styles.keyScrollView12}>
                                        <Checkbox
                                          checked={item.value == 1 ? true : false}
                                          label={item.label}
                                          onChange={(checked) => this.onCheckbox(checked, index)}
                                          labelStyle={{ fontSize: scale(12) }}
                                          checkboxStyle={{ width: scale(30), height: scale(30) }}
                                          labelBefore={true}
                                          containerStyle={{ margin: scale(-5) }}
                                        />
                                      </View> :

                                      item.type == 'parent' ?

                                        <View style={styles.keyScrollView12}>

                                          <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.keyScrollText10}
                                              numberOfLines={1}
                                            >{item.label}</Text>
                                            {
                                              item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(18), textAlignVertical: 'center' }}> *</Text> : null
                                            }

                                          </View>

                                          <View style={styles.parentStyle}>

                                            <RNPickerSelect
                                              placeholder={{
                                                label: "Selected Empty",
                                                value: "",
                                                color: 'grey',
                                                fontSize: scale(12),
                                                fontWeight: 'bold',
                                              }}

                                              items={item.dropdown}
                                              onValueChange={value => this.setDropdown(value, index)}
                                              style={{
                                                inputIOS: styles.inputIOSP,
                                                inputAndroid: styles.inputAndroidP,
                                                iconContainer: styles.iconContainerP
                                              }}

                                              value={item.module == null ? item.dropdown[0].value : item.module}
                                              useNativeAndroidPickerStyle={false}
                                              textInputProps={{ underlineColor: 'yellow' }}
                                              Icon={() => {
                                                return (
                                                  <View
                                                    style={styles.triangleStyle}
                                                  />
                                                );
                                              }}
                                            />



                                            <View style={styles.keyParentView}>

                                              <TouchableOpacity
                                                disabled={item.module != '' ? false : true}
                                                onPress={this._handleRelate.bind(this, item.module, index)}
                                                style={styles.keyScrollTouch1}>

                                                <Text style={styles.keyScrollText4}
                                                  numberOfLines={1}>{item.value}</Text>
                                              </TouchableOpacity>

                                              <TouchableOpacity
                                                onPress={this._handleReset.bind(this, index)}>

                                                <Image
                                                  source={Images.reset}
                                                  style={{
                                                    width: scale(15),
                                                    height: scale(15)
                                                  }}
                                                  resizeMode={'contain'}
                                                />
                                              </TouchableOpacity>

                                            </View>

                                          </View>






                                        </View>

                                        :
                                        item.type == "address" ?
                                          <View style={{
                                            width: '95%', marginTop: scale(5),
                                            borderWidth: scale(1),
                                            borderColor: "#ddd",
                                            backgroundColor: '#fff',
                                            padding: scale(10)
                                          }}>

                                            {this._renderAddress(item.address_form, index)}

                                          </View> :


                                          <View style={styles.keyScrollView12}>
                                            <View style={{ flexDirection: 'row' }}>
                                              <Text style={styles.keyScrollText10}
                                                numberOfLines={1}
                                              >{item.label}</Text>
                                              {
                                                item.required == 1 ? <Text style={{ color: 'red', fontSize: scale(12), lineHeight: scale(18), textAlignVertical: 'center' }}> *</Text> : null
                                              }

                                            </View>

                                            <TextInput
                                              key={index}
                                              style={styles.keyScrollTxtInput4}
                                              placeholder={item.required == 1 ? "Required" : ""}
                                              placeholderTextColor='#565656'
                                              underlineColorAndroid='transparent'
                                              onChangeText={(edit_text) =>
                                                this.onInputChange(edit_text, index)}
                                              value={item.value}
                                            />

                                          </View>
            }


          </View>

        }
      />

    )


  }



  render() {

    const { isFetching, module_name, relate_list } = this.props

    return (
      <View style={styles.container}>
        <LogoSpinner loading={isFetching} />

        {this._keyboardScrollViewRender()}

        {this._assignRender()}
        {this._emailRender()}
      </View>
    );
  }
}





ModuleGenerateScreen.defaultProps = {
  list: [],
  edit_list: [],
  isFetching: false,
  saveStatus: '',
  relate_list: []
}



const mapStateToProps = (state) => {
  return {
    list: state.moduleGenerate.list,
    edit_list: state.moduleGenerate.edit_list,

    isFetching: state.moduleGenerate.isFetching,
    session_id: state.user.session_id,
    error: state.moduleGenerate.error,
    saveStatus: state.moduleGenerate.save_status,
    relate_list: state.moduleGenerate.relate_list
  };
};


function mergeProps(stateProps, dispatchProps, ownProps) {

  const { dispatch } = dispatchProps;
  const moduleGenerateRedux = require("@redux/ModuleGenerateRedux");
  const leadsRedux = require("@redux/LeadsRedux");

  return {
    ...ownProps,
    ...stateProps,
    fetchGenerateForm: (session_id, name, views) => {
      moduleGenerateRedux.actions.fetchGenerateForm(dispatch, session_id, name, views);
    },
    fetchSaveForm: (session_id, name, json_data) => {
      moduleGenerateRedux.actions.fetchSaveForm(dispatch, session_id, name, json_data);
    },
    fetchRelateModule: (session_id, name) => {
      moduleGenerateRedux.actions.fetchRelateModule(dispatch, session_id, name);
    },
    fetchSaveDoc: (session_id, obj, base64, filename) => {
      moduleGenerateRedux.actions.fetchSaveDoc(dispatch, session_id, obj, base64, filename);
    },
    fetchSaveNote: (session_id, obj, base64, filename) => {
      moduleGenerateRedux.actions.fetchSaveNote(dispatch, session_id, obj, base64, filename);
    },
    contacts_id: (id) => dispatch(leadsRedux.actions.contacts_id(id)),
    accounts_id: (id) => dispatch(leadsRedux.actions.accounts_id(id)),
  };
}


export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ModuleGenerateScreen);








