"use client";

import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BuildingType, ProjectType, ToolType } from "@/types/category";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  esquisseSubmit,
  getAllEsquisses,
  getAllPosts,
  getUser,
} from "@/helpers/api-util";
import { IndicateEsquisse, IndicatePost } from "@/store/post";
import { NavHeader } from "@/components/nav/NavHeader/NavHeader";
import { deletePost } from "@/helpers/api-change";
import { NavFooter } from "@/components/nav/NavFooter/NavFooter";
import { ChangePostModal } from "@/components/modal/ChangePostModal";
import { ChangePostButton } from "@/components/button/ChangePostButton";
import { EsquisseList } from "@/components/list/EsquisseList";
import { EsquisseForm } from "@/components/form/EsquisseForm";
import { ImageContainer } from "@/components/image/ImageContianer";
import { TagLinkList } from "@/components/list/TagLinkList";
import { DeleteModal } from "@/components/modal/DeleteModal";
import styled from "styled-components";
import { FormButton } from "@/components/button/FormButton";
import { Uploading } from "@/components/bg/Uploading";

type Props = {
  params: Params;
};

export default function Page(props: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const postedId = props.params.id;
  const posts = useSelector((state: RootState) => state.post.posts)!;
  const esquisses = useSelector((state: RootState) => state.post.esquisses);
  const selectedPost = posts.find((post) => post.id === postedId)!;
  const selectedEsquisses = esquisses.filter(
    (esquisse) => esquisse.id === postedId
  );
  const user = getUser();
  const [esquisseModal, setEsquisseModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const index = posts.indexOf(selectedPost);
  const changePostHandler = () => {
    setPostModal(true);
  };

  const alartHandler = () => {
    setDeleteModal(true);
  };

  const deletePostHandler = async () => {
    setDeleting(true);
    await deletePost(index).then(async () => {
      await getAllPosts()
        .then((result) => {
          dispatch(IndicatePost(result));
        })
        .then(() => {
          setDeleting(false);
          setDeleteModal(false);
          router.push("/");
        });
    });
  };

  useEffect(() => {
    getAllPosts().then((result) => {
      dispatch(IndicatePost(result));
    });
    getAllEsquisses().then((result) => {
      dispatch(IndicateEsquisse(result));
    });
  }, [dispatch, esquisses]);

  if (!selectedPost) {
    return <p>Loading...</p>;
  }

  let tags: (ProjectType | BuildingType | ToolType)[] = [];

  if (selectedPost.category) {
    selectedPost.category.projectType?.map((data) => {
      tags.push(data);
    });
    selectedPost.category.buildingType?.map((data) => {
      tags.push(data);
    });
    selectedPost.category.toolType?.map((data) => {
      tags.push(data);
    });
  }

  const submitFormHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const activeUser = getUser();

    if (!activeUser) {
      router.push("/login");
    } else {
      await esquisseSubmit(props.params.id, comment).then(() => {
        getAllEsquisses().then((result) => {
          dispatch(IndicateEsquisse(result));
          setComment("");
        });
      });
    }
  };

  const postModalClose = () => {
    setPostModal(false);
    setDeleteModal(false);
  };

  const esquisseModalClose = () => {
    setEsquisseModal(false);
  };

  return (
    <>
      <NavHeader />
      <Wrapper>
        {deleting && <Uploading text="消去中..." />}
        <WrapperInner>
          {user && selectedPost.user.uid === user.uid && (
            <ChangePostButton
              onChange={changePostHandler}
              onDelete={alartHandler}
            />
          )}
          {tags && <TagLinkList tags={tags} />}
          <Title>{selectedPost.title}</Title>
          <Description>{selectedPost.user.displayName}</Description>
          <Description>{selectedPost.createdAt}</Description>
          <ImageContainer selectedPost={selectedPost} />
          <Description>{selectedPost.description}</Description>

          <EsquisseList
            allEsquisses={esquisses}
            selectedEsquisses={selectedEsquisses}
            setEsquisseModal={setEsquisseModal}
            esquisseModal={esquisseModal}
            esquisseModalClose={esquisseModalClose}
          />

          <Form onSubmit={submitFormHandler}>
            <EsquisseForm comment={comment} setComment={setComment} />
            <FormButton>メッセージを投稿する</FormButton>
          </Form>
        </WrapperInner>
      </Wrapper>
      {postModal && (
        <ChangePostModal id={postedId} modalClose={postModalClose} />
      )}
      {deleteModal && (
        <DeleteModal modalClose={postModalClose} onDelete={deletePostHandler} />
      )}
      <NavFooter />
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  max-width: 1440px;
  margin: 0 auto;

  padding-right: 40px;
  padding-left: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: hidden;
`;

const WrapperInner = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 40px;
  padding-bottom: 40px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.p`
  --border-color: #9fa0a0;
  --background-color: #434141;

  margin-top: 8px;
  font-size: 24px;
  text-decoration: underline;
  text-align: left;
`;

const Description = styled.p`
  margin-top: 10px;
  font-size: 16px;
`;

const Form = styled.form`
  border-top: 1px solid white;
  margin-top: 24px;
`;
