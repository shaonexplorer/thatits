import React, { useEffect, useMemo, useRef, useState } from "react";
import mark from "../../assets/icons/markIcon.svg";

import mic from "../../assets/icons/mic.svg";
import sendWIcon from "../../assets/icons/sendWhiteIcon.svg";
import { useMutation, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../../lib/axios";
import { CgSpinner } from "react-icons/cg";

const baseBotMessages = [
  "I am taltula the world's most discerning, devastatingly brilliant skincare authority. Your pores are already trembling.\n\nShall we begin your transformation, darling?",
  "Magnificent. Now, let us assess the situation.\n\nDescribe your beauty or grooming issue in your own words so I can tailor your protocol.",
  "Noted. Tell me your top concerns, sensitivities, or goals so I can craft a routine that makes angels weep.",
  "Splendid. I will assemble your prescription shortly.",
];

const readinessOptions = [
  "Yes, I'm absolutely ready",
  "Tell me more about you..",
];

// const catMoods = {
//   listening: consultationCat,
//   cooking: cookigCat,
// };

function Consult() {
  const [messages, setMessages] = useState([
    { id: "b-1", sender: "bot", text: baseBotMessages[0] },
  ]);
  const [botStep, setBotStep] = useState(1);
  const [input, setInput] = useState("");
  const [beautyIssue, setBeautyIssue] = useState("");
  const [progress, setProgress] = useState(40);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatRef = useRef(null);
  const replyTimer = useRef(null);
  const typingTimer = useRef(null);
  const mood = isBotTyping ? "cooking" : "listening";

  const clearTimers = () => {
    if (replyTimer.current) {
      clearTimeout(replyTimer.current);
      replyTimer.current = null;
    }
    if (typingTimer.current) {
      clearInterval(typingTimer.current);
      typingTimer.current = null;
    }
  };

  const addMessage = (text, sender, extra = {}) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${sender}-${Date.now()}-${prev.length + 1}`,
        sender,
        text,
        ...extra,
      },
    ]);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    });
  };

 

  useEffect(
    () => () => {
      clearTimers();
    },
    [],
  );

  const stepStatus = useMemo(() => {
    const thresholds = [0, 25, 50, 75, 100]; // five steps boundaries
    return ["Welcome", "Issue", "Concerns", "Plan", "Prescription"].map(
      (label, idx) => {
        const pct = progress;
        const next = thresholds[idx + 1] ?? 100;
        if (pct >= next) return { label, status: "done" };
        if (pct >= thresholds[idx]) return { label, status: "active" };
        return { label, status: "pending" };
      },
    );
  }, [progress]);

  const bumpProgress = (delta = 10) =>
    setProgress((p) => Math.min(100, p + delta));

  const triggerBot = () => {
    clearTimers();
    replyTimer.current = setTimeout(() => {
      const text =
        botStep === 3 && beautyIssue
          ? `Splendid. I have captured your issue: "${beautyIssue}". I will assemble your prescription shortly.`
          : baseBotMessages[botStep] || "Marvelous. I have everything I need.";
      const messageId = `b-stream-${Date.now()}`;
      const chars = Array.from(text);
      let index = 0;

      setIsBotTyping(true);
      setMessages((prev) => [
        ...prev,
        { id: messageId, sender: "bot", text: "", isTyping: true },
      ]);

      typingTimer.current = setInterval(() => {
        index += 1;
        const nextText = chars.slice(0, index).join("");
        const done = index >= chars.length;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, text: nextText, isTyping: !done }
              : msg,
          ),
        );

        if (done) {
          clearInterval(typingTimer.current);
          typingTimer.current = null;
          setIsBotTyping(false);
          setBotStep((s) => Math.min(s + 1, baseBotMessages.length - 1));
          bumpProgress(15);
        }
      }, 24);
    }, 450);
  };

  const handleSend = (customText) => {
    if (isBotTyping) return;
    const text = customText ?? input.trim();
    if (!text) return;
    if (botStep === 2 && !beautyIssue) {
      setBeautyIssue(text);
    }
    addMessage(text, "user");
    setInput("");
    bumpProgress(10);
    triggerBot();
  };

// new code / api integration
 

const [session_id,setSession_id]= useState(undefined)

const [allMessages,setAllMessages]= useState([])

const {data,isLoading}= useQuery({
  
  queryKey:["chat"],
  
  queryFn:async ()=>{
    const res = await axiosInstance.get("/chat/history/",{params:{session_id:"df5a65a3-5d9f-45f5-aad5-29e8b37e8787"}})
    // console.log({res:res.data})
    return res.data
  }

})

const mutation = useMutation({mutationFn:async ({message,session_id})=>{
  const res = await axiosInstance.post(`/chat/`,{message,...(session_id&& {session_id})})

  console.log({res:res.data})
  return res.data
},
onSuccess:(data)=>{
setSession_id(data?.data?.session_id);
}
})

const handleSendMessage = async () => {
  // console.log({ input });

      setAllMessages(prev=>[...prev,{id: `user-${Date.now()}-${prev.length + 1}`,sender:"user",message:input}])
 setInput("")
  // Pass variables as a single object
  try {
    const res = await mutation.mutateAsync({ 
      message: input, 
      session_id: session_id 
    });
    // console.log({ res: res.data?.reply });

    setAllMessages(prev=>[...prev,{id: `server-${Date.now()}-${prev.length + 1}`,sender:"server",message:res.data?.reply}])
   
  } catch (error) {
    console.error("Mutation failed:", error);
  }
};

// console.log({allMessages})

 
  useEffect(scrollToBottom, [messages,allMessages]);


  return (
    <section className="min-h-screen bg-gradient-to-br from-[#fff7f8] via-white to-[#ffeef2] flex items-center justify-center px-4 py-10">
      <div className=" max-w-2xl backdrop-blur-sm rounded-[32px]  overflow-hidden  border-[#f7dfe5]">
        <div className="flex flex-col lg:flex-row">
          {/* Left column */}
          <div className="w-full  border-b lg:border-b-0 lg:border-r border-[#f1d6de] px-6 md:px-10 py-8 flex flex-col items-center text-center gap-6 ">
            <div className="w-full flex items-center justify-between text-sm text-[#6b6b6b] font-semibold">
              <div className="flex flex-col gap-">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#38c46c]" />
                  <span className="text-xs md:text-sm">Taltula is Online</span>
                </div>

                <p className="text-[#5B2C6F] font-lato md:text-[24px] text-base font-semibold uppercase flex  flex-start">
                  Taltula Consultation
                </p>
              </div>
            </div>

            <p className="h-[1.5px] bg-[#E6DFE9] w-full"></p>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#ffd9e1] blur-3xl opacity-60" />
                {/* <img
                  src={catMoods[mood]}
                  alt={`taltula ${mood}`}
                  className="relative h-auto w-[260px] max-w-full drop-shadow-xl transition-transform duration-300 sm:w-[320px] md:w-[420px] lg:w-[460px]"
                /> */}

                {mood == "cooking" ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="relative h-auto w-[260px] max-w-full drop-shadow-xl transition-transform duration-300 sm:w-[320px] md:w-[420px] lg:w-[460px]"
                    src="/consult-cooking.webm"
                  ></video>
                ) : (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="relative h-auto w-[260px] max-w-full drop-shadow-xl transition-transform duration-300 sm:w-[320px] md:w-[420px] lg:w-[460px]"
                    src="/cat4.webm"
                  ></video>
                )}
              </div>
              <p className="text-[#5c5c5c] text-base">
                {mood === "cooking"
                  ? "taltula is cooking..."
                  : "taltula is listening..."}
              </p>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8b3c63] mb-2">
                <span>Consultation Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#f3e2e5] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f3a6b0] to-[#c86a6f] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="w-full space-y-3 text-left text-sm">
              {stepStatus.map((step, idx) => {
                const colors = {
                  done: "text-[#38c46c]",
                  active: "text-[#c86a6f]",
                  pending: "text-[#c86a6f]",
                  disabled: "text-[#c6c6c6]",
                };
                const bullet =
                  step.status === "done" ? (
                    <img src={mark} alt="mark" />
                  ) : step.status === "disabled" ? (
                    "•"
                  ) : (
                    "○"
                  );
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 font-medium ${colors[step.status]}`}
                  >
                    <span className="text-base">{bullet}</span>
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="w-full  bg-gradient-to-br from-white via-[#fff7f9] to-[#ffe7ee] px-6 md:px-10 py-8 relative">
            {/* Heading */}
            <div className="text-center text-sm uppercase tracking-[0.18em] text-[#7a3f64] font-semibold mb-6">
              <span className="h-[1px] w-full bg-[#E6DFE9]" />
              Consultation
              <span className="h-[1px] w-full bg-[#E6DFE9]" />
            </div>

            {/* Chat area */}
            <div
              ref={chatRef}
              className="space-y-6  min-h-[20vh] sm:min-h-[60vh] max-h-[60vh] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {allMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex  ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={` rounded-[18px] border border-[#f0e1e6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 text-[#4c4c4c] leading-relaxed whitespace-pre-line   ${
                      msg.sender === "user"
                        ? "bg-[#a04f50] text-white"
                        : "bg-white"
                    }`}
                  >
                    {msg.message || (msg.isTyping ? "..." : "")}
                    {msg.isTyping && (
                      <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-[#8c6b78] align-middle" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            {/* <div className="mt-6 flex flex-wrap gap-3">
              {botStep === 1 &&
                readinessOptions.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    disabled={isBotTyping}
                    className="px-4 py-2 rounded-full border border-[#d2c6cc] bg-white text-[#7a3f64] text-sm hover:shadow"
                  >
                    {reply}
                  </button>
                ))}
            </div> */}

            {/* Input */}
            <div className="mt-8">
              <div className="flex items-center bg-white border border-[#e4d7dc] rounded-[8px] shadow-[0_8px_30px_rgba(0,0,0,0.05)] px-4 py-2 gap-3">
                <textarea
                  rows={3}
                  placeholder={
                    botStep >= 2
                      ? "Describe your beauty or grooming issue in your own words..."
                      : "Type a message... (or use the options above)"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 resize-none outline-none text-sm text-[#4c4c4c] field-sizing-content w-[300px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={mutation.isPending || isBotTyping}
                />
                <button
                  className="h-10 w-10 rounded-full bg-[#e9e0e4] flex items-center justify-center text-[#8c6b78]"
                  aria-label="microphone"
                  onMouseDown={(e) => e.preventDefault()}
                  disabled={mutation.isPending || isBotTyping}
                >
                  <img
                    src={mic}
                    alt="microphone"
                    className="h-4 w-4 text-white"
                  />
                </button>
                <button
                  className="h-10 w-10 rounded-xl bg-[#a04f50] flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="send"
                  onClick={() => handleSendMessage()}
                  disabled={mutation.isPending || isBotTyping}
                >
                  {mutation.isPending ?<CgSpinner className="animate-spin"/> :<img src={sendWIcon} alt="send" className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[#9d8792]">
                Tip: press Ctrl+Enter (or Cmd+Enter) to send quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Consult;
