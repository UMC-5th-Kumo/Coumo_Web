import React, { useEffect, useState } from 'react';
import Title from '../../components/common/Title';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import TwoBtnPopUp from '../../components/common/popUp/TwoBtnPopUp';
import { useSelector } from 'react-redux';
import {
  PageNext,
  PageNextDisable,
  PagePrev,
  PagePrevDisable,
} from '../../assets';
import PostList from '../../components/admin/neighborhood/PostList';
import { defaultInstance } from '../../api/axios';
import { LuTrash2 } from 'react-icons/lu';

const MyPosts = () => {
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [postData, setPostData] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [num, setNum] = useState(null);

  const navigate = useNavigate();
  const { pageId } = useParams();
  const { ownerId } = useSelector((state) => state.user);

  /* ---- 게시글 목록 불러오기 함수 (get)  ---- */
  const posts = async () => {
    try {
      const response = await defaultInstance.get(
        `/api/notice/${ownerId}/list?pageId=${pageId}`
      );
      if (response.data.isSuccess) {
        console.log('MyPostList Success:', response.data);
        setPostData(response.data.result.notice);
        setNum(response.data.result.total);
      }
    } catch (error) {
      console.error('MyPostList Error:', error);
    }
  };

  /* ----- 랜더링 시, 게시글 목록 불러오기 && selectedPost 초기화 ----- */
  useEffect(() => {
    posts();
    setSelectedPostId('');
  }, [currentPage]);

  /* ----- selectedPost 변경 시 즉시 업데이트 ----- */
  useEffect(() => {
    setSelectedPostId(selectedPostId);
  }, [selectedPostId]);

  /* ----- 페이지 이동 처리 ----- */
  useEffect(() => {
    // URL에서 페이지 ID를 가져와 현재 페이지 설정
    setCurrentPage(Number(pageId) || 1);
  }, [pageId]);

  /* ----- 페이지 이동 버튼 클릭 시 ----- */
  const handlePageChange = (newPage) => {
    if (newPage <= 0) {
      newPage = 1;
    }
    setCurrentPage(newPage);
    navigate(`/neighborhood/myPosts/${newPage}`);
  };

  /* ---- 페이지 이동 버튼 상태관리 ---- */
  useEffect(() => {
    setNextButtonDisabled(postData.length < 10);
  }, [currentPage, postData.length]);

  /* ----- 팝업 뒷배경 스크롤, 클릭 방지 ----- */
  if (deletePopUp) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  /* ----- 게시글 삭제 버튼 ----- */
  const onDeleteConfirm = async () => {
    try {
      const response = await defaultInstance.patch(
        `/api/notice/${ownerId}/delete/${selectedPostId}`
      );

      if (response.data.isSuccess) {
        console.log('delete post 성공');
        posts();
        navigate('/neighborhood/myPosts/1');

        setDeletePopUp(false);
      } else {
        console.error('delete post 실패', response.data.message);
      }
    } catch (error) {
      console.error('delete post 에러');
    }
  };

  return (
    <Container>
      <TitleBox>
        <Title title={`${num}개의 게시글이 있어요!`} />
      </TitleBox>
      <BottomContainer>
        <PostWrapper>
          <PostList
            filteredPosts={postData}
            setDeletePopUp={setDeletePopUp}
            setSelectedPostId={setSelectedPostId}
          />
        </PostWrapper>
        <Page>
          {currentPage === 1 ? (
            <PagePrevDisable
              onClick={() => handlePageChange(currentPage - 1)}
            />
          ) : (
            <PagePrev onClick={() => handlePageChange(currentPage - 1)} />
          )}
          <PageNum>{currentPage}</PageNum>
          {nextButtonDisabled ? (
            <PageNextDisable />
          ) : (
            <PageNext onClick={() => handlePageChange(currentPage + 1)} />
          )}
        </Page>
      </BottomContainer>
      {deletePopUp && (
        <TwoBtnPopUp
          title='글 삭제하기'
          text='정말 삭제하시겠습니까?'
          btnLabel='삭제하기'
          setOpen={setDeletePopUp}
          onClick={onDeleteConfirm}
          icon={<LuTrash2 />}
        />
      )}
    </Container>
  );
};

export default MyPosts;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  padding-top: 70px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #fafafa;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 70px;

  @media screen and (max-width: 980px) {
    padding: 0px 0px 50px 40px;
  }
`;

const Page = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const PostWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 30px 70px;

  @media screen and (max-width: 980px) {
    padding: 30px 40px;
  }
`;

const BottomContainer = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 70px;
`;

const PageNum = styled.div`
  color: ${({ theme }) => theme.colors.text_darkgray};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
`;
