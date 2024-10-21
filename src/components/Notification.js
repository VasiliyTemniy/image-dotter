const Notification = ({ message , type, shown }) => {

  const style = {
    borderColor: type === 'error' ? 'red' : 'green',
    opacity: shown ? 1 : 0,
  };

  return <div id="notification" style={style}>{message}</div>;

};

Notification.displayName = 'Notification';

export default Notification;