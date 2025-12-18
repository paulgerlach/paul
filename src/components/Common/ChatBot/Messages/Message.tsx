import { UIMessage, UIDataTypes, UITools } from "ai";
import { SiChatbot } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message({
  message,
  isUser,
}: {
  message: UIMessage<unknown, UIDataTypes, UITools>;
  isUser: boolean;
}) {
  const components = {
    a: (props: any) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      />
    ),
    strong: (props: any) => <strong {...props} className="font-bold" />,
    ul: (props: any) => (
      <ul {...props} className="list-disc list-inside ml-4" />
    ),
    ol: (props: any) => (
      <ol {...props} className="list-decimal list-inside ml-4" />
    ),
    h1: (props: any) => <h1 {...props} className="text-lg font-bold mt-3" />,
    h2: (props: any) => <h2 {...props} className="text-base font-bold mt-2" />,
    h3: (props: any) => <h3 {...props} className="text-sm font-bold mt-2" />,
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <SiChatbot
          color="#FFFFFF"
          className="bg-black rounded-full p-2"
          size={40}
        />
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
          isUser
            ? "bg-black text-white rounded-br-sm"
            : "bg-white text-gray-700 rounded-bl-sm"
        }`}
      >
        {message.parts.map((part, index) =>
          part.type === "text" ? (
            <div key={index} className="break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {part.text}
              </ReactMarkdown>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
