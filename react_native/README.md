# React_Native0.57.8

## Genymotion react-native init --version 0.57.8 projectname

```
設定->語法與輸入設定 : 開啟實體鍵盤
openGAPP(Genymotion右上角) 下載Play商店 -> 下載keyboard中文版
```

---

cd project -> react-native start
cd project -> react-native run-android

---

#### flex 布局

```
https://github.com/crazycodeboy/RNStudyNotes/blob/master/React%20Native%E5%B8%83%E5%B1%80/React%20Native%E5%B8%83%E5%B1%80%E8%AF%A6%E7%BB%86%E6%8C%87%E5%8D%97/React%20Native%E5%B8%83%E5%B1%80%E8%AF%A6%E7%BB%86%E6%8C%87%E5%8D%97.md
```

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

```

```

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

```
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');
//使用firebase web sdk 時候必須在index中導入
```

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

```
記得要自己在openPicker後面(又或者.then後面)加上catch
點擊取消鍵時才不會出現錯誤訊息
```

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

---

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

---

#### image_upload_on_UI 在 head_portrait_finish 資料夾

error :

```
Unable to load script from assets 'index.android.bundle' 請重新安裝android/app/src/assets
1.刪除assets
2.mkdir android\app\src\main\assets
3.react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
4.react-native run-android

ps. 不然安裝套件時npm install 套件 ，修改build.gradle，react-native link，run-android， 要"一次"在vs ccode裡搞定
```

```
Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
目前是用 console.disableYellowBox = true; (不好的解決辦法)
```

---

使用 firebase ， npm install native-base@2.11.0 ， npm install react-navigation@2.18.2 ， npm install react-native-vector-icons@6.2.0 ， npm install react-native-swipeout ， npm install react-native-modalbox ， npm install apsl-react-native-button
，rn-fetch-blob，react-native-image-crop-picker

#### Comprehensive_instance (like 那邊有 bug 並且已經在下一篇修改

```
"dependencies": {
    "apsl-react-native-button": "^3.1.1",
    "firebase": "^5.8.4",
    "native-base": "^2.11.0",
    "react": "16.6.3",
    "react-native": "0.57.8",
    "react-native-datepicker": "^1.7.2",
    "react-native-image-crop-picker": "^0.22.0",
    "react-native-modalbox": "^1.7.1",
    "react-native-swipeout": "^2.3.6",
    "react-native-vector-icons": "^6.2.0",
    "react-navigation": "^2.18.2",
    "rn-fetch-blob": "^0.10.15"
  },
  "devDependencies": {
    "babel-jest": "24.1.0",
    "jest": "24.1.0",
    "metro-react-native-babel-preset": "0.52.0",
    "react-test-renderer": "16.6.3"
  },
  "jest": {
    "preset": "react-native"
  }
```

```
this.setState後面如果想接函式(ex: .then)，用this.setState({},()=>{})
```

---

##### Share

```
1.setState array object 看這篇
https://www.freecodecamp.org/forum/t/reactjs-using-setstate-to-update-a-single-property-on-an-object/146772/3
2.Image source={require(原本想要放物件)}不允許放物件 必須這樣改寫 再用 source={object}的方式
3.tab內嵌stack時，tab切換跳轉回stack最上層
  navigationOptions: ({ navigation }) => ({
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            if (navigation.state.routeName == 'Group') {
              //路由到Group時
              navigation.dispatch(navigateAction); //用dispatch執行action
            }
            defaultHandler();
          },.........省略
  const navigateAction = NavigationActions.navigate({
  routeName: 'Group', //給父router
  params: {},
  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'GroupsScreen' }) //想要路由到的子router
});
```

#### Datepicker

```
npm install react-native-datepicker
1. 注意使用Datepicker 根據裝置環境 會有時差問題
```

#### Section

```
還有Bug : 1.按like後取消刊登 ， 結果like的對象還在，2.自己也必須禁止按自己like，3.Group那邊，如果按送出太快，資料庫會重複寫進2次 4.快速來回切換tab navigation ，search和like介面會重複出現項目(麻煩參考group介面的作法)

```
#### 簡易Modal

