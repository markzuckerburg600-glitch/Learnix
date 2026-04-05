import React from 'react';

const QuizButton = ({click, not}: {click: () => void, not: boolean}) => {
  return (
    <div className="relative inline-block group">
      <div className="p-4">
        <button 
          onClick={click} 
          disabled={not}
          className="relative bg-yellow-300 hover:bg-white hover:scale-105 active:bg-yellow-300 active:scale-98 px-5 py-3 border-none rounded-[30%/200%] cursor-pointer text-black/60 font-inter font-semibold text-base capitalize transition-all duration-200 shadow-[0_0_0_1px_rgb(0_0_0/0.12),0_1px_1px_rgb(3_7_18/0.02),0_5px_4px_rgb(3_7_18/0.04),0_12px_9px_rgb(3_7_18/0.06),0_20px_15px_rgb(3_7_18/0.08),0_32px_24px_rgb(3_7_18/0.1)] hover:rounded-[10%/200%] active:rounded-[20%/200%] flex items-center justify-center"
        >
          <span>Generate Quiz</span>
          <svg className="ml-2 h-6 stroke-1 stroke-black/30 fill-white/90 transition-all duration-300 group-hover:stroke-black/40 group-hover:fill-yellow-300 group-active:stroke-black/45 group-active:fill-[#f1ff76]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.6744 11.4075L15.7691 17.1233C15.7072 17.309 15.5586 17.4529 15.3709 17.5087L3.69348 20.9803C3.22819 21.1186 2.79978 20.676 2.95328 20.2155L6.74467 8.84131C6.79981 8.67588 6.92419 8.54263 7.08543 8.47624L12.472 6.25822C12.696 6.166 12.9535 6.21749 13.1248 6.38876L17.5294 10.7935C17.6901 10.9542 17.7463 11.1919 17.6744 11.4075Z" />
            <path d="M3.2959 20.6016L9.65986 14.2376" />
            <path d="M17.7917 11.0557L20.6202 8.22724C21.4012 7.44619 21.4012 6.17986 20.6202 5.39881L18.4989 3.27749C17.7178 2.49645 16.4515 2.49645 15.6704 3.27749L12.842 6.10592" />
            <path d="M11.7814 12.1163C11.1956 11.5305 10.2458 11.5305 9.66004 12.1163C9.07426 12.7021 9.07426 13.6519 9.66004 14.2376C10.2458 14.8234 11.1956 14.8234 11.7814 14.2376C12.3671 13.6519 12.3671 12.7021 11.7814 12.1163Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default QuizButton;
