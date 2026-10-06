"use client";
import ChatItem from "./ChatItem";

export default function ChatList({ chats, seleccionado, onSelect }) {
  if (chats.length === 0) {
    return <p className="vacio">Todavía no tenés chats. ¡Creá uno con los botones de arriba!</p>;
  }
  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id_chat}
          chat={chat}
          activo={seleccionado === chat.id_chat}
          onClick={() => onSelect && onSelect(chat.id_chat)}
        />
      ))}
    </ul>
  );
}