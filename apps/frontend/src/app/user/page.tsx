import styles from './page.module.css';
import Text from '@repo/ui/Text';
import FormSection from '@/_components/pages/user/FormSection';

export default function Page() {
  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" align="center" className={styles.title}>
        Start Interview
      </Text>
      <FormSection />
    </div>
  );
}
