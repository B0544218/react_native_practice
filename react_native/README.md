# React_Native0.57.8

## Genymotion react-native init --version 0.57.8 projectname

---

cd project -> react-native start
cd project -> react-native run-android

---

---

基本使用 Button 模板

```
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      test: 0
    };
  }

  handlerSubmit=()=> {
  this.setState({
      test: this.state.test + 1
    });
  }

.........
render(
  return(
    <Button style={{ backgroundColor: '#e74c3c', borderWidth: 0, margin: 10 }}
            textStyle={{ fontSize: 18, color: 'white' }}
            onPress={
              this.handlerSubmit
            }
          >按鈕
          <TouchableOpacity />   <------ 如果用Navigation時並且又用Debugger時 要加上
     </Button>
```

---

#### 屬性傳遞

cd project/test2
react-native start

cd project/test2
react-native run-android

---

#### 登入介面

cd project/login2
react-native start

cd project/login2
react-native run-android

使用了 react-native-vector-icons 方法(如果透明的話)

1.
Edit android/app/build.gradle ( NOT android/build.gradle ) and add the following:

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

2.
react-native link

---

#### 滾輪&對不同裝置調整圖片大小

cd project/scroll2
react-native start

cd project/scroll2
react-native run-android

---

#### 滾動式和引用.json

cd project/flash2
react-native start

cd project/flash2
react-native run-android

使用了 maxs15 / react-native-modalbox , react-native-vector-icons, dancormier / react - native - swipeout , APSL/react-native-button
備註 : 只有 flash2 在 AddModal 才會往最底層 (flash3 因為切割了模組 程式碼更改 所以新增時不會自動往最底層)
flash4 為橫向展現

---

#### (後台交互)啟用 json-server (需用 --watch db.json)

cd project/demo2
json-server --watch db.json

cd project/demo2
react-native start

cd project/demo2
react-native run-android

下載 jhen0409 / react-native-debugger (window version
然後用 remotely js debugging

使用 Genymotion 發現沒辦法正常顯示 FlatList 項目，即使 json 是在http://localhost:3000/.......
在使用 fetch 時，也要改成符合 Genymotion 的模擬器 IP -> fetch('http://10.0.3.2:3000/.......')

---

#### react-navigation (使用 npm install react-navigation@2.18.2)

cd project/nav1
react-native start

cd project/nav1
react-native run-android

在 nav2 中 ，又因為[定義 state]緣故，
所以記得使用的是 _this._ props.navigation 來處理路由跳轉又或著傳遞參數

在 nav3 中
[在 MainStack 的 headerMode: 'none'] : 把這一層的所有標題都去除掉，包含 RootStack 的 navigationOptions 的 title 資訊 ，但是 RootStack 里各個底下的
HomeScreen.navigationOptions，SettingsScreen.navigationOption，DetailScreen.navigationOptions 仍然有效果。
MainStack 底下放 主要節點 以及 分支節點 ，他們各有自己的首頁

---

## 綜合練習

cd project/instances
json-server --watch db.json

cd project/instances
react-native start

cd project/instances
react-native run-android

使用 react-native 0.57.8 版本 ，npm install react-navigation@2.18.2 ，npm install native-base，
使用了 maxs15 / react-native-modalbox , react-native-vector-icons(請看 github 安裝教學), dancormier / react-native-swipeout , APSL/react-native-button
在 BasicFlatList 中，考慮到上方的 icon 要左右對稱，原來的布局必須要修改
BasicFlatList 並沒有 this.props.navigation 所以要從 原來引用他的原件那裏傳遞 this.props.navigation 參數

---

試作品

![image](https://github.com/B0544218/react_native_practice/blob/master/react_native/gif%E7%B6%9C%E5%90%88%E5%AF%A6%E4%BE%8B.gif)

---

### FireBase

firebase 版本 5.8.3

npm install firebase

注意!

import firebase from '@firebase/app';

import '@firebase/database';

import '@firebase/auth';

import '@firebase/storage';

然後在 firebase 上 點擊專案設定來到 Database 底下

如果上方 Database 旁邊顯示 Cloud Firestore 點擊他 將他選為 Realtime Database

###### 進行註冊 auth()註冊

首先到 Firebase 上的 Authentication 的登入方式 打開 "電子郵件/密碼"

註冊 Authentication 並送出驗證信件

firebase.auth().createUserWithEmailAndPassword(郵件,密碼)

並在 createUserWithEmailAndPassword 方法裡 加上

firebase.auth().currentUser.sendEmailVerification()

登入 並在之後才可使用 firebase.auth().currentUser 功能

firebase.auth().signInWithEmailAndPassword(郵件,密碼)

並在 signInWithEmailAndPassword 之後 加上

firebase.auth().currentUser.emailVerified 檢查是否 信箱驗證

---

###### react-native-image-crop-picker 讀取 Genymotion 上的圖片

react-native-image-crop-picker 版本 0.22.0

安裝方式(參考 :ivpusic https://github.com/ivpusic/react-native-image-crop-picker)

state = {

    photo: null

};

......

return( ...
{photo && (

          <Image....    />

)}  
此方式說明當 photo 有圖片時才讓 Image 變得能用

---

### rn-fetch-blob 和 firebase

rn-fetch-blob 版本 0.10.15

##### 另外記得要打開 React Native Debugger(在後台交互篇有使用方式) 才可以上傳到 firebase

RNFetchBlob.fs.readFile() 讀取圖片位址並轉呈 base64

再用

RNFetchBlob.polyfill.Blob.build() 讀 base64 並轉 jpg 的 blob 物件 ，接著用 firebase.storage().ref(uid).child(命名圖片).put() 告訴 storage 它的類型並上傳這張圖片

###### dp 變數 為了找出圖片被存的 address

###### uid 變數 為資料夾名稱 ， 命名的圖片名稱要不同 否則會被覆蓋掉

使用 YellowBox 和 lodash 方式 把 setting timer 的黃色方塊隱藏起來

使用 npm install firebase ， react-native-image-crop-picker 安裝方式看上篇內容 ， npm install rn-fetch-blob 並且要 react-native link

---

---

### 結合 firebase 的 Login Register

請看 finish_login 以及 finish_register

使用 YellowBox 和 lodash 方式 把 setting timer 的黃色方塊隱藏起來

使用 firebase ， npm install native-base@2.11.0 ， npm install react-navigation@2.18.2 ， npm install react-native-vector-icons@6.2.0 ， npm install react-native-swipeout ， npm install react-native-modalbox ， npm install apsl-react-native-button

```
babel-jest 24.0.0
jest 24.0.0
```

* * *
### ReadFirebase_and_contentComponent_separate
```
1. 在finish_login中可以知道 在你從登入頁面進入到其他頁面後 你的uid不用傳遞 皆可使用
2. contentComponent 要分開組件，否則 "頭像" 沒辦法做到單獨render
3. 安裝的套件如同   結合 firebase 的 Login Register 裡面所述
```
```
read firebase模板
firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid + '/user_image')
      .on('value', snapshot => {
        console.log(snapshot.val());
        this.setState({ 某個state: snapshot.val() });
      });
```