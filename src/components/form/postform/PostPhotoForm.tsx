"use client";

import styled from "styled-components";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type Props = {
  onFileUploadToFirebase: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploaded: boolean;
  loading: boolean;
  imageSource: string | StaticImport | undefined;
};

export const PostPhotoForm = ({
  onFileUploadToFirebase,
  loading,
  isUploaded,
  imageSource,
}: Props) => {
  return (
    <Container>
      <Label>写真</Label>
      <RightContainer>
        <input
          multiple
          name="imageURL"
          type="file"
          accept=".png, .jpeg, .jpg"
          onChange={onFileUploadToFirebase}
          required
        />
        <PhotoContainer>
          <PhotoInner>
            {loading ? (
              <h2>アップロード中・・・</h2>
            ) : (
              <>
                {isUploaded && (
                  <>
                    {imageSource && (
                      <Image
                        src={imageSource}
                        alt="church"
                        layout={"fill"}
                        objectFit={"cover"}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </PhotoInner>
        </PhotoContainer>
      </RightContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid white;
`;

const RightContainer = styled.div`
  width: 90%;
`;

const Label = styled.label`
  width: 10%;
  text-align: center;
`;

const PhotoContainer = styled.div`
  --color-background: #dcdddd;

  width: 100%;
  height: 600px;
  padding-right: 80px;
  padding-left: 80px;
  margin-top: 8px;
  background-color: var(--color-background);
`;

const PhotoInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
