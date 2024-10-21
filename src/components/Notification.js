const Notification = ({ message , type, shown }) => {

  // if (message === null || message === '') {
  //   return null;
  // }

  // const style = {
  //   position: 'absolute',
  //   zIndex: 101,
  //   color: type === 'error' ? 'red' : 'green',
  //   background: 'lightgrey',
  //   fontSize: 20,
  //   borderStyle: 'solid',
  //   borderRadius: 5,
  //   padding: 10,
  //   marginBottom: 10,
  //   opacity: 0,
  //   animation: 'toggle-visibility-notificaion 5s forwards ease-in-out',
  // };

  const style = {
    color: type === 'error' ? 'red' : 'green',
    opacity: shown ? 1 : 0,
  };

  return <div id="notification" style={style}>{message}</div>;

};

Notification.displayName = 'Notification';

export default Notification;