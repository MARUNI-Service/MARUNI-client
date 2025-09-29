import { Button } from './shared/components/ui/Button';
import { Layout } from './shared/components/layout/Layout';

function App() {
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} 버튼이 클릭되었습니다.`);
  };

  const handleBackClick = () => {
    console.log('뒤로가기 버튼이 클릭되었습니다.');
  };

  return (
    <Layout
      title="MARUNI 컴포넌트 테스트"
      showBack
      onBack={handleBackClick}
    >
        <div className="space-y-8">
          {/* Button 컴포넌트 테스트 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Button 컴포넌트 테스트</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Primary 버튼</h3>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() => handleButtonClick('Primary Large')}
                  >
                    Primary Large
                  </Button>

                  <Button
                    variant="primary"
                    size="extra-large"
                    onClick={() => handleButtonClick('Primary Extra Large')}
                  >
                    Primary Extra Large
                  </Button>

                  <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={() => handleButtonClick('Primary Full Width')}
                  >
                    Primary Full Width
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Secondary 버튼</h3>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    size="large"
                    onClick={() => handleButtonClick('Secondary Large')}
                  >
                    Secondary Large
                  </Button>

                  <Button
                    variant="secondary"
                    size="extra-large"
                    onClick={() => handleButtonClick('Secondary Extra Large')}
                  >
                    Secondary Extra Large
                  </Button>

                  <Button
                    variant="secondary"
                    size="large"
                    fullWidth
                    onClick={() => handleButtonClick('Secondary Full Width')}
                  >
                    Secondary Full Width
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Disabled 상태</h3>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="large"
                    disabled
                  >
                    Disabled Primary
                  </Button>

                  <Button
                    variant="secondary"
                    size="large"
                    disabled
                  >
                    Disabled Secondary
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* 접근성 테스트 안내 */}
          <section className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-3">접근성 테스트 안내</h3>
            <ul className="text-blue-800 space-y-1 text-base">
              <li>• Tab 키로 모든 버튼 접근 확인</li>
              <li>• Enter/Space 키로 버튼 클릭 확인</li>
              <li>• 포커스 링이 명확하게 표시되는지 확인</li>
              <li>• 터치 영역이 60px 이상인지 확인</li>
            </ul>
          </section>

          {/* Layout 컴포넌트 테스트 안내 */}
          <section className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-green-900 mb-3">Layout 컴포넌트 테스트</h3>
            <ul className="text-green-800 space-y-1 text-base">
              <li>• 뒤로가기 버튼 클릭 확인</li>
              <li>• Header와 Main 영역 분리 확인</li>
              <li>• 제목 중앙 정렬 확인</li>
              <li>• 모바일 최적화 확인 (max-width 480px)</li>
            </ul>
          </section>
        </div>
    </Layout>
  )
}

export default App
