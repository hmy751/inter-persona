import RecordButton from "./_components/RecordButton/RecordButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={"page-layout-container"}>{children}</div>
      <RecordButton />
    </>
  );
}
