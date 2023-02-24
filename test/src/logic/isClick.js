export default function isClick(buttonID, buttonname) {
  const button = buttonID;
  try {
    buttonname = button.name.toString();
  } catch (error) {
    throw Error(`Unknown button '${button}'`);
  }
}
