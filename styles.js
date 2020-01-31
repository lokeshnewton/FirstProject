import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";


export default StyleSheet.create({

    renderItem1: {
        flex: 1, 
        flexDirection: 'row'
    },

    renderItem2: {
        flex: 1, 
        justifyContent: 'center'
    },

    flatlistView: {
        height: scale(1),
        width: "100%",
        backgroundColor: "#EDEDED",
    },

    listEmpView: {
        justifyContent: 'center', 
        alignItems: 'center'
    },

    listEmpText: {
        fontSize: scale(20), 
        fontWeight: 'bold', 
        textAlign: 'center'
    },

    container: {
        flexGrow : 1,
    },


    // Header Render Function

    headView1: {
        //height: scale(40), 
        flexDirection: 'row', 
        alignItems: "center",
        backgroundColor:'#fff',
        padding:scale(5)
    },

    headView2: {
        flex: 1, 
        alignItems: 'flex-start'
    },

    headView3: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginLeft:scale(10)
    },

    headImg1: {
        height: scale(15), 
        width: scale(15)
    },

    headText1 : {
        color: '#808080',
        fontSize: scale(15),
        marginLeft:scale(2),
        width:scale(60),
      

       // marginHorizontal: scale(5),
    },

    headView4: {
        flex: 2,
    },

    headText2: {
        color: '#ff5e00',
         textAlign: 'center',
         fontSize: scale(18),
         width:scale(190),
       //  backgroundColor:'red'
        
    },

    headView5: {
        flex: 1, 
        alignItems: 'flex-end',
    },

    headView6: {
        flexDirection: 'row', 
        alignItems: 'center'
    },

    headImg2: {
        height: scale(15), 
        width: scale(15)
    },

    headText3: {
        color: '#808080',
        fontSize: scale(15),
        marginLeft:scale(3),
        width:scale(40),
       
    },

    headView7: {
        height: scale(2),
        backgroundColor: '#38ba91',
        elevation: scale(3),
        shadowOffset: { width: scale(0), height: scale(2) },
        shadowOpacity: 0.9,
    },


    // Assign Render function

    assignContainer : {
        flex : 1
    },

    assignView1: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        margin:scale(30),
        shadowColor: "#000",
        shadowRadius: scale(5),
        elevation: scale(5),
        borderWidth: 1,
        borderColor: '#ddd',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        borderBottomWidth: 5,
        borderBottomColor:"#A5D781"

    }, 

    assignTouch1: {
        position: 'absolute', 
        bottom: scale(-15),
        alignSelf:"center"
        
    },

    assignImg1: {
        resizeMode: 'contain',
        width: scale(20),
        height: scale(20), 
    },

    assignText1: {
        fontSize: scale(15),
        alignSelf: 'center', 
        marginTop: scale(5),
    },

    assignView2: {
        height: scale(1), 
        backgroundColor: '#B9B9B9', 
        marginVertical: scale(10),
    },

    assignView3: {
        padding: scale(5),
    },

    assignText2: {
        width:scale(220),
        fontSize: scale(15), 
        color: '#3D8EE1',
    },

    assignText3: {
        fontSize: scale(12), 
        color: '#000',
        width:scale(140)
    },


    // Email Render

    emailContainer: {
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: "center",
        alignItems: "center"
    },

    emailView1: {
        backgroundColor: 'white',
        width: '70%',
        padding: scale(10),
        borderRadius: scale(5),
    },

    emailFlat1: {
        flexGrow: 0 
    },

    emailView2: {
        padding: scale(5), 
    },

    emailText1: {
        fontSize: scale(12), 
        color: '#3D8EE1',
    },

    emailTouch1: {
        width: scale(100),
        height: scale(40),
        padding: scale(10),
        backgroundColor: '#3D8EE1',
        borderRadius: scale(8),
        marginRight: scale(10),
        alignSelf: 'flex-end',
        marginTop: scale(10),
    },

    emailText2: {
        color: '#fff', 
        fontSize: scale(15),
        textAlign: 'center'
    },



    // Keyboard ScrollView Render

    keyScrollContainer: {
        marginBottom: scale(100)
    },

    keyScrollView1: {
        margin: scale(10)
    },

    keyScrollView2: {
        width: '95%',
        
    },

    keyScrollText1: {
        color: '#000',
        fontSize: scale(12),
        fontWeight: '800',
            
    },


    keyScrollView3: {
        // borderColor: 'grey',
        // borderWidth: scale(1),
        padding: scale(5),
        marginTop: scale(10),
        backgroundColor: '#e0e0eb',
        borderWidth : scale(1),
        borderColor : '#ff9800',
        borderRadius : scale(4)
    },
    
    keyScrollTxtInput1: {
        textAlignVertical: 'top',
        justifyContent: "flex-start",
        height: scale(100),
        fontSize: scale(15),
       
        
    },

    keyScrollView4: {
        width: '95%'
    },

    keyScrollText2: {
        color: '#000',
        fontSize: scale(15),
        fontWeight: '800'
    },

    keyScrollTxtInput2 : {
        height: scale(42),
        fontSize: scale(15),
        padding: scale(7),
        marginTop: scale(5),
    },

    keyScrollView5: {
        width: '95%',
        // backgroundColor: '#e0e0eb',
        // borderWidth : scale(1),
        // borderColor : '#ff9800',
    },

    keyScrollView6: {
        marginBottom: scale(5),
    },


    KeyEnumNewView : {
        width: scale(313),
        backgroundColor: '#e0e0eb',
        borderWidth : scale(1),
        borderColor : '#ff9800',
        borderRadius : scale(4)
    },

    keyScrollView7: {
        width: '95%', 
        marginBottom: scale(5),
       
    },

    keyScrollView8: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },

    keyScrollText3: {
        color: '#000',
        fontSize: 15,
        fontWeight: '800'
    },

    keyScrollImg1: {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollNew : {
        flexDirection:"row",
        marginTop:scale(5),
        height: scale(40), 
        justifyContent:'space-around', 
        backgroundColor: '#e0e0eb',
        borderWidth : scale(1),
        borderColor : '#ff9800',
        borderRadius : scale(4),
        alignItems : 'center'
    },

    keyScrollTouch1: {
       
        width:"90%",
       // backgroundColor: 'red'
    },

    keyScrollText4: {
       
        color: 'black',
        fontSize: scale(15),
        //borderColor: 'grey',
        //borderBottomWidth: scale(1),
    },

    keyScrollemailView1: {
        width: '95%', 
        marginBottom: scale(5)
    },

    keyScrollText5: {
        color: '#000', 
       // marginLeft: scale(10),
        fontSize: scale(12),
        fontWeight: '800'
    },

    keyScrollFlat1: {
        margin: scale(5),
        borderColor: 'red',
        flexGrow: 0
    },

    keyScrollemailView2: {
        padding: scale(5)
    },

    keyScrollemailView3: {
        flexDirection: 'row', 
        justifyContent: "space-between"
    },

    keyScrollemailText1: {
        fontSize: scale(15), 
        color: 'black', 
        fontWeight: 'bold',
        width : scale(200)
    },

    keyScrollemailImg1: {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollemailView4: {
        flexDirection: 'row', 
        justifyContent: "space-between"
    },

    keyScrollemailText2: {
        fontSize: scale(15), 
        color: 'black', 
        fontWeight: 'bold',
        width : scale(200),
        textDecorationLine: 'line-through',

    },

    keyScrollemailImg2: {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollemailView5: {
        flexDirection: 'row', 
        justifyContent: "space-between"
    },

    keyScrollemailText3: {
        fontSize: scale(15), 
        color: 'grey', 
        fontWeight: 'bold', 
        width : scale(200)
    },

    keyScrollemailImg3 : {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollemailView6: {
        flexDirection: 'row', 
        justifyContent: "space-between"
    },

    keyScrollemailText4:{
        fontSize: scale(15), 
        color: 'grey', 
        fontWeight: 'bold', 
        textDecorationLine: 'line-through',
        width : scale(200)
    },

    keyScrollemailImg4: {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollemailView7: {
        flexDirection: 'row', 
        justifyContent: "space-between"
    },

    keyScrollemailText5: {
        fontSize: scale(15), 
        color: 'black',
        width : scale(200)
    },

    keyScrollemailImg5: {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollemailView8: {
        flexDirection: 'row', 
        justifyContent: "space-between"
    },

    keyScrollemailText6: {
        fontSize: scale(15), 
        color: 'black',
        width : scale(200),
        textDecorationLine: 'line-through',
    },

    keyScrollemailImg6: {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollemailView9: {
        flexDirection: 'row', 
        justifyContent: "space-between"
    },

    keyScrollemailText7: {
        fontSize: scale(15), 
        color: 'grey',  
        width : scale(200)
    },

    keyScrollemailImg7: {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollemailView10: {
        flexDirection: 'row', 
        justifyContent: "space-between"
    },

    keyScrollemailText8: {
        fontSize: scale(15), 
        color: 'grey', 
        textDecorationLine: 'line-through',
        width : scale(200)
    },

    keyScrollemailImg8: {
        width: scale(20), 
        height: scale(20)
    },

    keyScrollTouch2 : {
        padding: scale(5),
        backgroundColor: '#FF9800',
        borderRadius: scale(3),
        marginTop: scale(10),
         marginRight: scale(10),
        alignSelf: 'flex-end'
    },

    keyScrollText6: {
        color: '#fff', 
        fontSize: scale(12),
        textAlign: 'center',
    },

    keyScrollView9 : {
        width: '95%',
    },

    keyScrollTxtInput3: {
        height: scale(42),
        fontSize: scale(15),
        padding: scale(7),
        marginTop: scale(5),
        backgroundColor: '#e0e0eb',
        borderWidth : scale(1),
        borderColor : '#ff9800',
        borderRadius : scale(4)
    //   borderBottomColor: this.state.isFocused ? 'black'
    //  'red',
    //   borderBottomWidth: 1,
    },

    keyScrollView10: {
        width: '95%', 
        marginBottom: scale(5)
    },

    keyScrollText7: {
        color: '#000',
        fontSize: scale(12),
        fontWeight: '800'
    },

    datePickerStyle : {
        width: scale(200), 
        margin: scale(10),
        backgroundColor: '#e0e0eb',
        borderWidth : scale(1),
        borderColor : '#ff9800',
       
    },

    keyScrollView11: {
        width: '95%',
    },


    keyScrollTouch4: {
        marginTop: scale(5)
    },

    keyScrollText9: {
        width: '100%',
        color: 'black',
        fontSize: scale(15),
        borderColor: 'grey',
        borderBottomWidth: scale(1),
    },

    keyScrollView12: {
        width: '95%',
    },

    keyScrollText10: {
        color: '#000',
        fontSize: scale(12),
        fontWeight: '800'
    },

    keyScrollTxtInput4: {
        //height: scale(42),
        fontSize: scale(15),
        padding: scale(7),
        marginTop: scale(5),
        backgroundColor: '#e0e0eb',
        borderWidth : scale(1),
        borderColor : '#ff9800',
        borderRadius : scale(4)
        //shadowOffset: { width: 0, height: 2 },
        //shadowOpacity: 0.5, e0e0eb
        
    },
   

        inputIOS: {
            fontSize: scale(12),
            paddingVertical: scale(12),
            paddingHorizontal: scale(10),
            //borderWidth: scale(1),
            //borderColor: 'gray',
            //borderRadius: scale(4),
            color: 'black',
            paddingRight: scale(40),
            marginTop:scale(5)
             // to ensure the text is never behind the icon
          },
          inputAndroid: {
            fontSize: scale(12),
            paddingHorizontal: scale(10),
            paddingVertical: scale(8),
            //borderWidth: scale(0.5),
            //borderColor: 'purple',
            //borderRadius: scale(8),
            color: 'black',
            paddingRight: scale(40),
            marginTop:scale(5)
             // to ensure the text is never behind the icon
          },
          iconContainer: {
                        top: scale(20),
                        right: scale(12),
                      },

           triangleStyle:{

            backgroundColor: 'transparent',
            borderTopWidth: scale(10),
            borderTopColor:  '#ff5e00',
            borderRightWidth: scale(10),
            borderRightColor: 'transparent',
            borderLeftWidth: scale(10),
            borderLeftColor: 'transparent',
            width: 0,
            height: 0,
           },

           parentStyle:{
            borderColor:'#ff9800',
            borderWidth:scale(1),
            padding:scale(10),
            marginTop:scale(5),
            borderRadius:scale(10),
            backgroundColor:"#fff"
           },
           
           
           // Parent Square View stylw

           inputIOSP: {
            fontSize: scale(12),
            paddingVertical: scale(12),
            paddingHorizontal: scale(10),
            borderWidth: scale(1),
            borderColor: '#38ba91',
            borderRadius: scale(4),
            color: 'black',
            paddingRight: scale(40),
            marginTop:scale(5)
             // to ensure the text is never behind the icon
          },
          inputAndroidP: {
            fontSize: scale(12),
            paddingHorizontal: scale(10),
            paddingVertical: scale(8),
            borderWidth: scale(1),
            borderColor: '#38ba91',
            borderRadius: scale(4),
            color: 'black',
            paddingRight: scale(40),
            marginTop:scale(5)
             // to ensure the text is never behind the icon
          },
          iconContainerP: {
                        top: scale(20),
                        right: scale(12),
                      },

           triangleStyle:{

            backgroundColor: 'transparent',
            borderTopWidth: scale(10),
            borderTopColor:  '#ff5e00',
            borderRightWidth: scale(10),
            borderRightColor: 'transparent',
            borderLeftWidth: scale(10),
            borderLeftColor: 'transparent',
            width: 0,
            height: 0,
           },

           keyParentView : {
            flexDirection:"row",
            marginTop:scale(15),
            height: scale(20), 
            justifyContent:'space-around',
            borderRadius: scale(4),
            backgroundColor: '#fff',
            borderBottomWidth : scale(1),
            borderColor : '#38ba91',
            alignItems : 'center'
        },
                  
    
})
