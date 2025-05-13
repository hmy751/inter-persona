import Text from '@repo/ui/Text';
import styles from './QuestionEvaluationSection.module.css';
import { useGetResult } from '@/_data/result';
import { useParams } from 'next/navigation';

interface QuestionEvaluationSectionProps {}

export default function QuestionEvaluationSection({}: QuestionEvaluationSectionProps): React.ReactElement {
  const resultId = useParams().resultId;
  const { data, isLoading, error } = useGetResult(Number(resultId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>no data</div>;
  }

  return (
    <div className={styles.wrapper}>
      <Text as="h3" size="md">
        Question Evaluation
      </Text>
      {data?.contentFeedback.map(({ question, feedback }, index) => (
        <div className={styles.question} key={question}>
          <div className={styles.questionHeader}>
            <Text size="sm" weight="bold">
              {index + 1}. {question}
            </Text>
          </div>
          <Text size="sm">{feedback}</Text>
        </div>
      ))}
    </div>
  );
}
