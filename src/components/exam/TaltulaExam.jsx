import   { useEffect, useMemo, useRef, useState } from "react";
import {
  FiAward,
  FiCheck,
  FiClock,
  FiHeart,
  FiRefreshCw,
  FiShare2,
  FiShuffle,
  FiX,
} from "react-icons/fi";
import { shareWithFallback } from "../../utils/share";
import {
  createFreshGameState,
  formatExamCountdown,
  getDailyPuzzle,
  getDifficultyTone,
  getExamCycleKey,
  getMillisecondsUntilNextExamReset,
  loadStoredGameState,
  saveStoredGameState,
} from "./connectionsDaily";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import Skeleton from "../common/Skeleton";

const MISTAKES_ALLOWED = 4;

const randomShuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
};

const hydrateStateForPuzzle = (puzzle) => {
  const fresh = createFreshGameState(MISTAKES_ALLOWED);
  const stored = loadStoredGameState(puzzle.dateKey, puzzle.id, MISTAKES_ALLOWED);

  if (!stored) {
    return fresh;
  }

  const validWordIds = new Set(puzzle.words.map((word) => word.id));
  const validGroupIds = new Set(puzzle.groups.map((group) => group.id));
  const solvedGroupIds = stored.solvedGroupIds.filter((groupId) =>
    validGroupIds.has(groupId),
  );
  const solvedWordIds = new Set(
    puzzle.words
      .filter((word) => solvedGroupIds.includes(word.groupId))
      .map((word) => word.id),
  );

  const selectedWordIds =
    stored.status === "playing"
      ? stored.selectedWordIds
          .filter(
            (wordId) => validWordIds.has(wordId) && !solvedWordIds.has(wordId),
          )
          .slice(0, 4)
      : [];

  const solvedAllGroups = solvedGroupIds.length === puzzle.groups.length;
  const noMistakesLeft = stored.mistakesRemaining <= 0;

  return {
    ...fresh,
    ...stored,
    selectedWordIds,
    solvedGroupIds,
    status: solvedAllGroups
      ? "won"
      : noMistakesLeft
        ? "lost"
        : stored.status,
  };
};

const buildResultsMessage = (status, solvedCount, attemptsUsed, mistakesRemaining) => {
  if (status === "won") {
    return `I solved today's Talula Daily Exam in ${attemptsUsed} guesses with ${mistakesRemaining} mistakes left.`;
  }

  return `I played today's Talula Daily Exam and solved ${solvedCount}/4 groups.`;
};

function ResultsModal({
  isOpen,
  onClose,
  onRetry,
  puzzle,
  gameState,
  isWinUser
}) {
  const [shareFeedback, setShareFeedback] = useState("");

  useEffect(() => {
    if (!shareFeedback) {
      return undefined;
    }

    const timer = setTimeout(() => setShareFeedback(""), 2200);
    return () => clearTimeout(timer);
  }, [shareFeedback]);

  if (!isOpen) {
    return null;
  }

  const solvedCount = gameState.solvedGroupIds.length;
  const isWin = isWinUser || gameState.status === "won";
  const shareMessage = buildResultsMessage(
    gameState.status,
    solvedCount,
    gameState.attemptsUsed,
    gameState.mistakesRemaining,
  );
  const title = isWin ? "You Win." : "You Lost.";
  const subtitle = isWin
    ? "Impeccable taste. Talula approves your glow intelligence."
    : "Not quite today but even the best routines need refinement.";

  const handleShare = async () => {
    const result = await shareWithFallback({
      title: `${puzzle.title} Results`,
      message: shareMessage,
      url: "/exam",
    });

    if (result.status === "copied") {
      setShareFeedback("Copied");
      return;
    }

    if (result.status === "failed") {
      setShareFeedback("Unavailable");
      return;
    }

    setShareFeedback("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2b2c31]/60 px-4 py-8 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[420px] rounded-[28px] border border-[#ebe8e3] bg-[#f8f8f6] px-6 pb-9 pt-6 shadow-[0_26px_70px_rgba(10,12,20,0.35)] sm:px-8 sm:pt-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e4ddd6] text-[#886f75] transition hover:bg-white"
          aria-label="Close results"
        >
          <FiX />
        </button>

        <div className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#f4efba]">
          {isWin ? (
            <FiAward className="text-[2.3rem] text-[#c98207]" />
          ) : (
            <FiHeart className="text-[2.3rem] text-[#f54d43]" />
          )}
        </div>

        <h2 className="mt-8 text-center font-playfair text-[3.2rem] leading-none text-[#1d2234] sm:text-[3.4rem]">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-[310px] text-center text-[1.2rem] leading-[1.45] text-[#4f6078]">
          {subtitle}
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={isWin ? handleShare : onRetry}
            className="inline-flex h-16 w-full items-center justify-center gap-3 rounded-[16px] bg-[#824544] px-5 text-[1.2rem] font-medium text-white shadow-[0_10px_24px_rgba(60,20,25,0.28)] transition hover:bg-[#733b3a]"
          >
            {isWin ? <FiShare2 /> : <FiRefreshCw />}
            {isWin ? "Share Your Results" : "Try Again"}
          </button>
          {isWin && (
            <p className="mt-2 min-h-5 text-center text-[0.78rem] font-medium tracking-[0.06em] text-[#9a6770]">
              {shareFeedback}
            </p>
          )}
        </div>

        <div className="mt-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-16 w-full items-center justify-center rounded-[16px] border border-[#f1bdca] bg-transparent px-5 text-[1.2rem] font-medium text-[#9f0f46] transition hover:bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function TaltulaExam() {
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [puzzle, setPuzzle] = useState(() => getDailyPuzzle(new Date()));
  const [gameState, setGameState] = useState(() => hydrateStateForPuzzle(puzzle));
  const [wordOrder, setWordOrder] = useState(() => puzzle.words.map((word) => word.id));
  const [feedback, setFeedback] = useState("Select 4 words to submit a guess.");
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [boardNudge, setBoardNudge] = useState(false);
  const nudgeTimerRef = useRef(null);

  const wordsById = useMemo(
    () => new Map(puzzle.words.map((word) => [word.id, word])),
    [puzzle.words],
  );
  const groupsById = useMemo(
    () => new Map(puzzle.groups.map((group) => [group.id, group])),
    [puzzle.groups],
  );

  const solvedGroupSet = useMemo(
    () => new Set(gameState.solvedGroupIds),
    [gameState.solvedGroupIds],
  );
  const selectedWordSet = useMemo(
    () => new Set(gameState.selectedWordIds),
    [gameState.selectedWordIds],
  );

  const orderedWords = useMemo(() => {
    const fallbackOrder = puzzle.words.map((word) => word.id);
    const hasValidOrder =
      wordOrder.length === fallbackOrder.length &&
      wordOrder.every((wordId) => wordsById.has(wordId));
    const activeOrder = hasValidOrder ? wordOrder : fallbackOrder;

    return activeOrder.map((wordId) => wordsById.get(wordId)).filter(Boolean);
  }, [puzzle.words, wordOrder, wordsById]);

  const unsolvedWords = useMemo(
    () => orderedWords.filter((word) => !solvedGroupSet.has(word.groupId)),
    [orderedWords, solvedGroupSet],
  );

  const solvedGroups = useMemo(
    () => gameState.solvedGroupIds.map((groupId) => groupsById.get(groupId)).filter(Boolean),
    [gameState.solvedGroupIds, groupsById],
  );

  const countdownLabel = useMemo(
    () => formatExamCountdown(getMillisecondsUntilNextExamReset(new Date(currentTime))),
    [currentTime],
  );

  const solvedCount = gameState.solvedGroupIds.length;

  useEffect(
    () => () => {
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nextCycleKey = getExamCycleKey(now);
      setCurrentTime(now.getTime());

      if (nextCycleKey !== puzzle.dateKey) {
        const nextPuzzle = getDailyPuzzle(now);
        setPuzzle(nextPuzzle);
        setGameState(createFreshGameState(MISTAKES_ALLOWED));
        setWordOrder(nextPuzzle.words.map((word) => word.id));
        setFeedback("New exam is live. Mistakes reset to 4.");
        setIsResultsOpen(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [puzzle.dateKey]);

  useEffect(() => {
    saveStoredGameState(puzzle.dateKey, puzzle.id, gameState);
  }, [gameState, puzzle.dateKey, puzzle.id]);

  const handleWordClick = (wordId) => {
    if (gameState.status !== "playing") {
      return;
    }

    const word = wordsById.get(wordId);
    if (!word || solvedGroupSet.has(word.groupId)) {
      return;
    }

    if (
      !selectedWordSet.has(wordId) &&
      gameState.selectedWordIds.length >= 4
    ) {
      setFeedback("Only four words can be selected at a time.");
      return;
    }

    setGameState((previous) => {
      const isSelected = previous.selectedWordIds.includes(wordId);
      return {
        ...previous,
        selectedWordIds: isSelected
          ? previous.selectedWordIds.filter((id) => id !== wordId)
          : [...previous.selectedWordIds, wordId],
      };
    });
  };

  const handleDeselect = () => {
    if (!gameState.selectedWordIds.length) {
      return;
    }

    setGameState((previous) => ({
      ...previous,
      selectedWordIds: [],
    }));
    setFeedback("Selection cleared.");
  };

  const handleShuffle = () => {
    if (gameState.status !== "playing") {
      return;
    }

    setWordOrder((previous) => {
      const baseOrder =
        previous.length === puzzle.words.length &&
        previous.every((wordId) => wordsById.has(wordId))
          ? previous
          : puzzle.words.map((word) => word.id);

      const unsolvedIds = baseOrder.filter((wordId) => {
        const word = wordsById.get(wordId);
        return word && !solvedGroupSet.has(word.groupId);
      });

      const shuffledUnsolved = randomShuffle(unsolvedIds);
      let pointer = 0;

      return baseOrder.map((wordId) => {
        const word = wordsById.get(wordId);
        if (!word || solvedGroupSet.has(word.groupId)) {
          return wordId;
        }

        const nextId = shuffledUnsolved[pointer];
        pointer += 1;
        return nextId;
      });
    });

    setFeedback("Words shuffled.");
  };

  const handleSubmit = () => {
    if (gameState.status !== "playing") {
      return;
    }

    if (gameState.selectedWordIds.length !== 4) {
      setFeedback("Select exactly four words.");
      return;
    }

    const selectedWords = gameState.selectedWordIds
      .map((wordId) => wordsById.get(wordId))
      .filter(Boolean);

    if (selectedWords.length !== 4) {
      setFeedback("Selection invalid. Try again.");
      return;
    }

    const targetGroupId = selectedWords[0].groupId;
    const isCorrect =
      !solvedGroupSet.has(targetGroupId) &&
      selectedWords.every((word) => word.groupId === targetGroupId);

    if (isCorrect) {
      const matchedGroup = groupsById.get(targetGroupId);
      const nextSolvedGroupIds = [...gameState.solvedGroupIds, targetGroupId];
      const isWin = nextSolvedGroupIds.length === puzzle.groups.length;

      setGameState((previous) => ({
        ...previous,
        selectedWordIds: [],
        solvedGroupIds: nextSolvedGroupIds,
        attemptsUsed: previous.attemptsUsed + 1,
        status: isWin ? "won" : "playing",
        lastOutcome: "correct",
      }));
      setFeedback(`Correct: ${matchedGroup?.category ?? "Connection solved."}`);
      if (isWin) {
        setIsResultsOpen(true);
      }
      return;
    }

    const nextMistakes = Math.max(0, gameState.mistakesRemaining - 1);
    const hasLost = nextMistakes === 0;

    setGameState((previous) => ({
      ...previous,
      selectedWordIds: [],
      attemptsUsed: previous.attemptsUsed + 1,
      mistakesRemaining: nextMistakes,
      status: hasLost ? "lost" : "playing",
      lastOutcome: "incorrect",
    }));
    setFeedback(
      hasLost
        ? "No attempts left. Results are ready."
        : "Not a group. Try a different set of four.",
    );

    setBoardNudge(true);
    if (nudgeTimerRef.current) {
      clearTimeout(nudgeTimerRef.current);
    }
    nudgeTimerRef.current = setTimeout(() => setBoardNudge(false), 220);
    if (hasLost) {
      setIsResultsOpen(true);
    }
  };

  const handleRetry = () => {
    setGameState(createFreshGameState(MISTAKES_ALLOWED));
    setWordOrder(puzzle.words.map((word) => word.id));
    setBoardNudge(false);
    setFeedback("New attempt started. Mistakes reset to 4.");
    setIsResultsOpen(false);
  };


  // new code/ api integration

 

     const [selectedWords,setSelectedWords]= useState([])
     const [allWords,setAllWords]= useState([])
     const [allMatchedGroups,setAllMatchedGroups]= useState([])  
     const [message,setMessage]= useState("Select 4 Words to submit a game")   
     const [solveCount,setSolveCount]= useState(0)
     const [mistakeCount,setMistakeCount]= useState(4)

     const [sessionId,setSessionId]= useState(null)  
     
     const [isWin,setIsWin]=useState(false)




  const {data,isLoading}= useQuery({queryKey:["game"],queryFn:async()=>{

    const res = await axiosInstance.get("/game/boards/")
 
    return res.data
 
  } })

  const mutaion = useMutation({mutationFn:async()=>{
    const res  = await axiosInstance.post("/game/submit/",{board_id:1,words:selectedWords.map(w=>w.text),...(sessionId && {session_id:sessionId})})
     return res
  },onSuccess:(res)=>{

    console.log({res})

    
    setMessage(res.data?.message)
    setSolveCount(res.data?.data?.game_state?.solved_groups_count)
    setSessionId(res.data?.data?.session_id)
    // setMistakeCount(res.data?.data?.game_state?.mistakes_remaining)


   const remainingWords = allWords.filter(
    (word) => !selectedWords.some((selected) => selected.id === word.id)
  );
  
  setAllWords(remainingWords);

  

  setAllMatchedGroups((prev)=>[...prev,{name:selectedWords[0].name,words:selectedWords.map(s=>s.text)}])
 

    setSelectedWords([])
  },
onError:(e)=>{
  
  // console.log({e:e?.response?.data})

setMessage(e.response?.data?.message)
setMistakeCount(e.response?.data?.errors?.game_state?.mistakes_remaining)
setSessionId(e.response?.data?.errors?.session_id)



 setBoardNudge(true);
    if (nudgeTimerRef.current) {
      clearTimeout(nudgeTimerRef.current);
    }
    nudgeTimerRef.current = setTimeout(() => setBoardNudge(false), 220);


setSelectedWords([])
}
})




  useEffect(()=>{
    if(data?.data){

      const result = data?.data?.[0].groups.flatMap(g=>g.words.map(w=>({id:w.id,text:w.text,name:g.name})))
      const shuffledWords = [...result].sort(() => Math.random() - 0.5);
      setAllWords(shuffledWords)
    }
  },[data])

 

 const handleWordClicks = (id,text,name)=>{
  if(selectedWords.some(w=> w.id==id)){
    setSelectedWords((prev)=>prev.filter(w=>w.id !== id))
    return
  }
  if(  selectedWords.length == 4){
    return
  }
  setSelectedWords(()=>[...selectedWords,{id,text,name}])
 }


const handleShuffleWords = ()=>{
  const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);

  setAllWords(shuffledWords)
}

const handleDeselectWords = ()=>{
  setSelectedWords([])
}

const handleRetryGame = () => {

       if(data?.data){

      const result = data?.data?.[0].groups.flatMap(g=>g.words.map(w=>({id:w.id,text:w.text,name:g.name})))
      const shuffledWords = [...result].sort(() => Math.random() - 0.5);
      setAllWords(shuffledWords)
    }

 setAllMatchedGroups([])
//  setAllWords([])
 setSolveCount(0)
 setMistakeCount(4)
 setSessionId(null)
 setMessage("Select 4 Words to submit a game")
    setBoardNudge(false);
   
    setIsResultsOpen(false);
  };


useEffect(()=>{

  if(allMatchedGroups.length ==4 || mistakeCount == 0){
    if(mistakeCount == 0){
      setIsWin(false)
    }else if (allMatchedGroups.length ==4){
setIsWin(true)
    }
    setIsResultsOpen(true)
  }
},[mistakeCount,allMatchedGroups.length])

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff7fa] via-[#fffdfd] to-[#fff6f8] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-[#ffd7e2]/45 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#f4ddf2]/35 blur-3xl" />

        <div className="relative mx-auto max-w-[1120px] rounded-[30px] border border-[#f3e3eb] bg-white/85 p-5 shadow-[0_18px_45px_rgba(68,33,60,0.1)] sm:p-8">
          <header className="flex flex-col gap-4 border-b border-[#f1e2e9] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9c8b97]">
                Daily Connections
              </p>
              <h1 className="mt-2 font-playfair text-[2rem] leading-none text-[#5e2340] sm:text-[2.35rem]">
                {puzzle.title}
              </h1>
              <p className="mt-2 text-sm text-[#7d6f79]">{puzzle.subtitle}</p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f0d8e2] bg-[#fff7fb] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#8d4868]">
                <FiClock />
                Next exam in {countdownLabel}
              </div>
              <p className="text-xs text-[#a18998]">
                {solveCount}/4 solved • {mistakeCount} mistakes remaining
              </p>
            </div>
          </header>

          {allMatchedGroups.length > 0 && (
            <div className="mt-5 space-y-3">
              {allMatchedGroups.map((group,index) => {
              const colors = ['yellow', 'green', 'blue', 'purple'];
  // const difficulty= colors[Math.floor(Math.random() * colors.length)];
                const tone = getDifficultyTone(colors[index]);

                return (
                  <article
                    key={group.id}
                    className={`rounded-2xl border px-4 py-3 transition-all duration-300 ${tone.panel}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#5c2f46]">
                        <FiCheck />
                        {group.name}
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.pill}`}>
                        {tone.label}
                      </span>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[#7a6877]">
                      {group.words.join(" • ")}
                    </p>
                  </article>
                );
              })}
            </div>
          )}

          <div
            className={`mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 transition-transform duration-200 ${
              boardNudge ? "translate-x-1" : "translate-x-0"
            }`}
          >

{(allWords.length ==0 &&  !isResultsOpen) && <>
<Skeleton />
<Skeleton />
<Skeleton />
<Skeleton />

{/*  */}

<Skeleton />
<Skeleton />
<Skeleton />
<Skeleton />

{/*  */}

<Skeleton />
<Skeleton />
<Skeleton />
<Skeleton />

{/*  */}

<Skeleton />
<Skeleton />
<Skeleton />
<Skeleton />
</>}

            {allWords?.map((word) => {
              // const isSelected = selectedWordSet.has(word.id);
              const isSelected = selectedWords.some(w=> w.id==word.id);

              // console.log({selectedWords})


              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleWordClicks(word.id,word.text,word.name)}
                  aria-pressed={isSelected}
                  className={`h-[88px] rounded-[14px] border px-2 text-center text-[1.2rem] font-semibold uppercase tracking-[0.02em] transition-all duration-200 sm:h-[100px] ${
                    isSelected
                      ? "border-[#ab5267] bg-[#ab5267] text-white shadow-[0_10px_24px_rgba(160,65,92,0.25)]"
                      : "border-[#ebdfe6] bg-[#fffdfd] text-[#7a6f79] hover:border-[#ddcad6] hover:bg-white"
                  }`}
                >
                  {word.text}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#7b6b75] truncate">{message}</p>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleShuffleWords}
                className="inline-flex items-center gap-2 rounded-full border border-[#ebd2dd] bg-white px-4 py-2 text-sm font-semibold text-[#9f4766] transition hover:bg-[#fff7fa]"
              >
                <FiShuffle />
                Shuffle
              </button>
              <button
                type="button"
                onClick={handleDeselectWords}
                disabled={selectedWords.length === 0}
                className="inline-flex items-center gap-2 rounded-full border border-[#edd6e0] bg-[#fffafb] px-4 py-2 text-sm font-medium text-[#bf7a96] transition enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiX />
                Deselect
              </button>
              <button
                type="button"
                disabled={selectedWords.length < 4}
                onClick={()=>mutaion.mutate()}
                className="rounded-full bg-[#5f1f40] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4f1935] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Submit Guess
              </button>
            </div>
          </div>

          {gameState.status !== "playing" && !isResultsOpen && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setIsResultsOpen(true)}
                className="rounded-full border border-[#dfbfcc] bg-[#fff4f8] px-4 py-2 text-sm font-semibold text-[#893f5e] transition hover:bg-[#ffeaf2]"
              >
                View Results
              </button>
            </div>
          )}
        </div>
      </section>

      <ResultsModal
        isOpen={isResultsOpen}
        onClose={() => {
        
          setIsResultsOpen(false)

          handleRetryGame()
        }
        
        }
        onRetry={handleRetryGame}
        puzzle={puzzle}
        gameState={gameState} isWinUser={isWin}
      />
    </>
  );
}

export default TaltulaExam;
