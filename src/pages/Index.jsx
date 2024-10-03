import DailyChecklist from '../components/DailyChecklist';
import TopMenu from '../components/TopMenu';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopMenu />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Checklist Diário</h1>
        <DailyChecklist />
      </div>
    </div>
  );
};

export default Index;