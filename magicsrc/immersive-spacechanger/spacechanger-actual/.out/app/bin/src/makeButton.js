import { ui } from 'lumin';

// function onPress (node, text) {
//   console.log('onPress triggered!');
//   counter++;
//   node.setText('Press again');
//   text.setText('Pressed ' + counter + ' time(s)');
// }

function makeButton (prism, text, onClick) {
  const { UiButton } = ui;
  let node = UiButton.Create(prism, text, 0, 0.1);
  console.log('makeButton');
  node.onActivateSub(function (uiEventData) {
    onClick(node, text);
  });
  return node;
}

export { makeButton };
