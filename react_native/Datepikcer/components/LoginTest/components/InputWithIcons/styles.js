import { StylesConst } from '../../common/constants/const';

export default (styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  textInput: {
    flex: 1,
    borderColor: StylesConst.textInput.borderColor,
    borderWidth: StylesConst.textInput.borderWidth,
    padding: StylesConst.textInput.padding,
    color: StylesConst.textInput.color
  }
});
