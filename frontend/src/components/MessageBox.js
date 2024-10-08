import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from './Message';
import { fetchMessages } from '../store/messagesSlice';

const MessageBox = () => {
  const messages = useSelector((state) => state.messages.messages);
  const dispatch = useDispatch();
  const currentChannelId = useSelector(
    (state) => state.channels.currentChannelId,
  );

  const filteredMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );
  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch, currentChannelId]);

  const messageBoxRef = React.createRef();
  useEffect(() => {
    const listRef = messageBoxRef.current;
    if (listRef) {
      listRef.scrollTop = listRef.scrollHeight;
    }
  }, [filteredMessages, messageBoxRef]);

  return (
    <div
      id="messages-box"
      className="chat-messages overflow-auto px-5 flex-grow-1"
      ref={messageBoxRef}
    >
      <div className="flex-grow-1 overflow-auto p-3">
        <ul className="list-unstyled">
          {filteredMessages.map((message) => (
            <Message
              key={message.messageId}
              messageId={message.messageId}
              username={message.username}
              body={message.body}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessageBox;
