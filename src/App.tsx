import { useState } from 'react';
import { Button } from './shared/components/ui/Button';
import { Layout } from './shared/components/layout/Layout';
import { Input } from './shared/components/ui/Input';
import { Card } from './shared/components/ui/Card';
import { LoadingSpinner } from './shared/components/ui/LoadingSpinner';

function App() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // 에러 발생 시뮬레이션
  if (shouldThrowError) {
    throw new Error('테스트 에러입니다! ErrorBoundary가 이 에러를 캐치합니다.');
  }

  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} 버튼이 클릭되었습니다.`);
  };

  const handleBackClick = () => {
    console.log('뒤로가기 버튼이 클릭되었습니다.');
  };

  const handleCardClick = (cardName: string) => {
    console.log(`${cardName} 카드가 클릭되었습니다.`);
  };

  return (
    <Layout
      title="MARUNI 컴포넌트 테스트"
      showBack
      onBack={handleBackClick}
    >
      <div className="space-y-8">
        {/* Button 컴포넌트 테스트 섹션 */}
        <Card padding="large">
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
        </Card>

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

        {/* Input 컴포넌트 테스트 섹션 */}
        <Card padding="large">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Input 컴포넌트 테스트</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">기본 입력 필드</h3>
              <div className="space-y-4">
                <Input
                  label="이름"
                  placeholder="이름을 입력하세요"
                  required
                />

                <Input
                  label="전화번호"
                  type="tel"
                  placeholder="010-0000-0000"
                  helperText="'-' 없이 숫자만 입력해주세요"
                />

                <Input
                  label="이메일"
                  type="email"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">특수 상태</h3>
              <div className="space-y-4">
                <Input
                  label="에러 상태"
                  placeholder="잘못된 입력"
                  error="올바른 형식으로 입력해주세요"
                  defaultValue="wrong input"
                />

                <Input
                  label="비활성 상태"
                  placeholder="입력할 수 없습니다"
                  disabled
                  defaultValue="disabled input"
                />

                <Input
                  label="긴 라벨 테스트"
                  placeholder="긴 라벨이 있는 입력 필드"
                  helperText="이것은 긴 도움말 텍스트입니다. 사용자에게 추가 정보를 제공합니다."
                  required
                />
              </div>
            </div>
          </div>
        </Card>

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

        {/* Input 접근성 테스트 안내 */}
        <section className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-purple-900 mb-3">Input 접근성 테스트 안내</h3>
          <ul className="text-purple-800 space-y-1 text-base">
            <li>• Tab 키로 모든 입력 필드 접근 확인</li>
            <li>• 라벨 클릭 시 해당 입력 필드 포커스 확인</li>
            <li>• 에러 메시지 스크린 리더 읽기 확인</li>
            <li>• 필수 입력 표시(*) 확인</li>
            <li>• 터치 영역 60px 이상 확인</li>
          </ul>
        </section>

        {/* Card 컴포넌트 테스트 섹션 */}
        <Card padding="large">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Card 컴포넌트 테스트</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">기본 카드</h3>
              <div className="space-y-4">
                <Card padding="small">
                  <h4 className="font-bold text-gray-900">Small Padding 카드</h4>
                  <p className="text-gray-600 mt-2">작은 패딩을 가진 카드입니다.</p>
                </Card>

                <Card padding="medium">
                  <h4 className="font-bold text-gray-900">Medium Padding 카드</h4>
                  <p className="text-gray-600 mt-2">중간 패딩을 가진 카드입니다.</p>
                </Card>

                <Card padding="large" shadow="large">
                  <h4 className="font-bold text-gray-900">Large Padding & Shadow 카드</h4>
                  <p className="text-gray-600 mt-2">큰 패딩과 그림자를 가진 카드입니다.</p>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">클릭 가능한 카드</h3>
              <div className="space-y-4">
                <Card
                  clickable
                  padding="medium"
                  onClick={() => handleCardClick('첫 번째 클릭 가능 카드')}
                >
                  <h4 className="font-bold text-gray-900">클릭해보세요!</h4>
                  <p className="text-gray-600 mt-2">이 카드는 클릭할 수 있습니다. 호버 효과와 포커스 상태를 확인해보세요.</p>
                </Card>

                <Card
                  clickable
                  padding="large"
                  shadow="medium"
                  onClick={() => handleCardClick('두 번째 클릭 가능 카드')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">안부 확인</h4>
                      <p className="text-gray-600 mt-1">오늘의 기분은 어떠신가요?</p>
                    </div>
                    <span className="text-2xl">😊</span>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">다양한 스타일</h3>
              <div className="grid grid-cols-1 gap-4">
                <Card rounded="small" shadow="none" padding="medium">
                  <p className="text-gray-700">둥글기: small, 그림자: none</p>
                </Card>

                <Card rounded="large" shadow="large" padding="medium">
                  <p className="text-gray-700">둥글기: large, 그림자: large</p>
                </Card>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 접근성 테스트 안내 */}
        <section className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-orange-900 mb-3">Card 접근성 테스트 안내</h3>
          <ul className="text-orange-800 space-y-1 text-base">
            <li>• Tab 키로 클릭 가능한 카드 접근 확인</li>
            <li>• Enter/Space 키로 카드 클릭 확인</li>
            <li>• 호버 시 시각적 피드백 확인</li>
            <li>• 포커스 상태 링 표시 확인</li>
            <li>• 클릭 시 살짝 축소 효과 확인</li>
          </ul>
        </section>

        {/* LoadingSpinner 컴포넌트 테스트 섹션 */}
        <Card padding="large">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            LoadingSpinner 컴포넌트 테스트
          </h2>

          <div className="space-y-8">
            {/* 크기 테스트 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">크기 변형</h3>
              <div className="flex gap-8 justify-around items-end">
                <div>
                  <LoadingSpinner size="small" label="작은 크기" />
                </div>
                <div>
                  <LoadingSpinner size="medium" label="중간 크기" />
                </div>
                <div>
                  <LoadingSpinner size="large" label="큰 크기" />
                </div>
              </div>
            </div>

            {/* 레이블 테스트 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">레이블 변형</h3>
              <div className="space-y-4">
                <LoadingSpinner label="데이터를 불러오고 있습니다..." />
                <LoadingSpinner label="저장 중입니다..." />
                <LoadingSpinner label="" />
              </div>
            </div>
          </div>
        </Card>

        {/* LoadingSpinner 접근성 테스트 안내 */}
        <section className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-indigo-900 mb-3">
            LoadingSpinner 테스트 안내
          </h3>
          <ul className="text-indigo-800 space-y-1 text-base">
            <li>• 스피너가 부드럽게 회전하는지 확인</li>
            <li>• 로딩 메시지가 명확하게 표시되는지 확인</li>
            <li>• 스크린 리더가 role="status"를 읽는지 확인</li>
            <li>• 3가지 크기가 적절한지 확인</li>
          </ul>
        </section>

        {/* ErrorBoundary 테스트 섹션 */}
        <Card padding="large">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            ErrorBoundary 컴포넌트 테스트
          </h2>

          <div className="space-y-4">
            <p className="text-lg text-gray-600 leading-relaxed">
              아래 버튼을 클릭하면 의도적으로 에러가 발생합니다.
              <br />
              ErrorBoundary가 에러를 캐치하여 사용자 친화적인 화면을 보여줍니다.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-base text-yellow-800 font-medium mb-2">
                ⚠️ 주의: 이 버튼은 개발 테스트용입니다
              </p>
              <p className="text-sm text-yellow-700">
                에러 발생 후 "다시 시도" 버튼으로 복구할 수 있습니다.
              </p>
            </div>

            <Button
              variant="secondary"
              size="large"
              fullWidth
              onClick={() => setShouldThrowError(true)}
            >
              🚨 에러 발생 테스트
            </Button>
          </div>
        </Card>

        {/* ErrorBoundary 테스트 안내 */}
        <section className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-red-900 mb-3">
            ErrorBoundary 테스트 안내
          </h3>
          <ul className="text-red-800 space-y-1 text-base">
            <li>• 에러 발생 버튼 클릭 시 에러 UI 표시 확인</li>
            <li>• "다시 시도" 버튼으로 복구 가능한지 확인</li>
            <li>• "홈으로 가기" 버튼 동작 확인</li>
            <li>• 개발 모드에서 에러 상세 정보 표시 확인</li>
          </ul>
        </section>
      </div>
    </Layout>
  )
}

export default App