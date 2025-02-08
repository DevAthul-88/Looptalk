import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

const ChatEmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiClick }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiObject: any) => {
    onEmojiClick(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={emojiRef} className="relative">
      <button 
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="text-gray-400 hover:text-gray-200 focus:outline-none"
      >
        <Smile size={20} />
      </button>
      
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
};

export default ChatEmojiPicker;