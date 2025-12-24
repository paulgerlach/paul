import { UIMessage, UIDataTypes, UITools } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { max_chat_avatar } from "@/static/icons";

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
        <div>
          {" "}
          <Image
            alt="chat avatar"
            src={max_chat_avatar.src}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
          isUser
            ? "bg-dark_green text-white rounded-br-sm"
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
