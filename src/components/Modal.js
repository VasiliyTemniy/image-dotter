import ReactDOM from 'react-dom';

/**
 * @param {{
 *   active: boolean,
 *   close: () => void,
 *   closeOnBgClick: boolean
 *   title: string,
 *   className?: string,
 *   children: React.ReactNode | React.ReactNode[]
 * }} params
 */
const Modal = ({
  active,
  close,
  closeOnBgClick,
  title,
  className,
  children
}) => {
  if (active) {
    return ReactDOM.createPortal(
      <>
        <div className="modal-backdrop" onClick={closeOnBgClick ? close : null}/>
        <div className={`modal ${className}`}>
          <h3 className="modal__header">
            {title}
            <button
              className="button modal__close"
              onClick={close}
            >
              <span>X</span>
            </button>
          </h3>
          <div className="modal__content">
            {children}
          </div>
        </div>
      </>
      , document.body);
  } else {
    return null;
  }
};

Modal.displayName = 'Modal';

export { Modal };