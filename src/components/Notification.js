const Notification = ({ message , type, shown }) => {

  const style = {
    borderColor: type === 'error' ? 'red' : 'green',
    opacity: shown ? 1 : 0,
    top: shown ? '1rem' : '-5rem'
  };

  return <div id="notification" style={style}>{message}</div>;

};

Notification.displayName = 'Notification';

export { Notification };