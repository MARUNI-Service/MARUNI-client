import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Input, Button, Card } from '@/shared/components';
import { Modal } from '@/shared/components/ui/Modal';
import { useGuardian } from '@/features/guardian';
import type { User } from '@/features/auth/types';
import { useToast } from '@/shared/hooks/useToast';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 보호자 검색 페이지
 * Phase 3-8: 실제 API 호출로 변경
 * - Journey 3 Phase 3: 보호자 검색
 * - 이메일로 검색 (searchMember API 사용)
 * - 검색 결과 표시
 */
export function GuardianSearchPage() {
  const navigate = useNavigate();
  const { searchGuardians, requestGuardian, isLoading } = useGuardian();
  const toast = useToast();

  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<User | null>(null);
  const [selectedGuardian, setSelectedGuardian] = useState<User | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    try {
      const searchResult = await searchGuardians(keyword);
      setResult(searchResult);
    } catch {
      toast.error('검색 결과가 없습니다');
      setResult(null);
    }
  };

  const handleSelectGuardian = (guardian: User) => {
    setSelectedGuardian(guardian);
    setShowConfirmDialog(true);
  };

  const handleConfirmRequest = async () => {
    if (!selectedGuardian) return;

    try {
      await requestGuardian({
        guardianId: selectedGuardian.id,
        relation: 'FAMILY', // 기본값
      });
      setShowConfirmDialog(false);

      toast.success('보호자 등록 요청을 보냈습니다!');
      navigate(ROUTES.GUARDIANS);
    } catch {
      toast.error('요청에 실패했습니다');
    }
  };

  return (
    <Layout title="보호자 찾기" showBack={true} onBack={() => navigate(-1)}>
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
        {result && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">검색 결과</h2>
            <Card padding="medium" className="space-y-3">
              <div>
                <div className="text-xl font-bold text-gray-900">{result.memberName}</div>
                <div className="text-base text-gray-600">{result.memberEmail}</div>
              </div>
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={() => handleSelectGuardian(result)}
              >
                선택
              </Button>
            </Card>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {keyword && !result && !isLoading && (
          <Card padding="large" className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg text-gray-600">검색 결과가 없습니다</p>
          </Card>
        )}

        {/* 확인 다이얼로그 (Modal) */}
        <Modal
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          title="보호자 등록"
        >
          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold">{selectedGuardian?.memberName}</span>님을
              보호자로 등록할까요?
            </p>
            <div className="text-base text-gray-600 space-y-1">
              <p>• 이상 징후 발생 시 알림</p>
              <p>• 대화 내역 공유</p>
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
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
