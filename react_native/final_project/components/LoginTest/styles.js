import { StylesConst } from './common/constants/const';

export default (styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  logoAndTitle: {
    flex: 1,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoAndTitleText: {
    color: StylesConst.textColor
  },
  login: {
    flex: 1,
    alignItems: 'center'
  },
  footer: {
    alignSelf: 'center',
    paddingBottom: 5
  },
  footerText: {
    color: StylesConst.textColor
  }
});
