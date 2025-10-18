import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Input, Button, Card } from '@/shared/components';
import { useGuardian } from '@/features/guardian';
import type { GuardianSearchResult } from '@/features/guardian';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 보호자 검색 페이지
 * - Journey 3 Phase 3: 보호자 검색
 * - 이메일/이름으로 검색
 * - 검색 결과 목록 표시
 */
export function GuardianSearchPage() {
  const navigate = useNavigate();
  const { searchGuardians, requestGuardian, isLoading } = useGuardian();

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<GuardianSearchResult[]>([]);
  const [selectedGuardian, setSelectedGuardian] = useState<GuardianSearchResult | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    const searchResults = await searchGuardians(keyword);
    setResults(searchResults);
  };

  const handleSelectGuardian = (guardian: GuardianSearchResult) => {
    setSelectedGuardian(guardian);
    setShowConfirmDialog(true);
  };

  const handleConfirmRequest = async () => {
    if (!selectedGuardian) return;

    try {
      await requestGuardian({ guardianId: selectedGuardian.id });
      setShowConfirmDialog(false);

      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('보호자 등록 요청을 보냈습니다!');
      navigate(ROUTES.GUARDIANS);
    } catch (error) {
      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('요청에 실패했습니다');
    }
  };

  return (
    <Layout title="보호자 찾기" showBack={true}>
      <div className="space-y-6 p-4">
        {/* 안내 메시지 */}
        <Card padding="medium" className="bg-blue-50">
          <p className="text-lg text-gray-700">
            이메일 또는 이름으로
            <br />
            보호자를 검색하세요
          </p>
        </Card>

        {/* 검색 입력 */}
        <div className="space-y-3">
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: younghee@example.com"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <Button
            variant="primary"
            size="extra-large"
            fullWidth
            onClick={handleSearch}
            disabled={isLoading || !keyword.trim()}
          >
            {isLoading ? '검색 중...' : '검색'}
          </Button>
        </div>

        {/* 검색 결과 */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">검색 결과</h2>
            {results.map((guardian) => (
              <Card key={guardian.id} padding="medium" className="space-y-3">
                <div>
                  <div className="text-xl font-bold text-gray-900">{guardian.name}</div>
                  <div className="text-base text-gray-600">{guardian.email}</div>
                  {guardian.phoneNumber && (
                    <div className="text-base text-gray-600">{guardian.phoneNumber}</div>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onClick={() => handleSelectGuardian(guardian)}
                >
                  선택
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* 검색 결과 없음 */}
        {keyword && results.length === 0 && !isLoading && (
          <Card padding="large" className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg text-gray-600">검색 결과가 없습니다</p>
          </Card>
        )}

        {/* 확인 다이얼로그 (Modal) */}
        {/* TODO: Phase 3-7에서 공통 Modal 컴포넌트로 교체 예정 */}
        {showConfirmDialog && selectedGuardian && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card padding="large" className="max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">보호자 등록</h2>
              <div className="space-y-2">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">{selectedGuardian.name}</span>님을
                  <br />
                  보호자로 등록할까요?
                </p>
                <div className="text-base text-gray-600 space-y-1">
                  <p>• 이상 징후 발생 시 알림</p>
                  <p>• 대화 내역 공유</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="large"
                  fullWidth
                  onClick={() => setShowConfirmDialog(false)}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onClick={handleConfirmRequest}
                  disabled={isLoading}
                >
                  {isLoading ? '요청 중...' : '등록하기'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
