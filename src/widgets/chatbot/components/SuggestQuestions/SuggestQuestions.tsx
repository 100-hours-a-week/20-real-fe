interface SuggestedQuestionsProps {
  onSelect: (text: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  const suggestions = ['휴가 신청하는 법을 알려줘.', '유료 구독료 지원 일정을 알려줘.'];

  return (
    <div className="w-full max-w-md space-y-3">
      {suggestions.map((text) => (
        <div
          key={text}
          onClick={() => onSelect(text)}
          className="bg-white border border-gray-100 p-3 rounded-xl text-sm text-gray-700 hover:bg-gray-100 cursor-pointer shadow-sm"
        >
          {text}
        </div>
      ))}
    </div>
  );
}
