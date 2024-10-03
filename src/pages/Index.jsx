import DailyChecklist from '../components/DailyChecklist';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Checklist Diário</h1>
        <DailyChecklist />
      </div>
    </div>
  );
};

export default Index;