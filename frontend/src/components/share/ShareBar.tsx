import * as React from "react";
import { axiosInstance as axios } from "../../axios";
import {
  Box,
  Button,
  Textarea,
  HStack,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { AttachmentIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

interface IShareBar {
  session: string;
}

const ShareBar = React.memo(({ session }: IShareBar): JSX.Element => {
  const { t } = useTranslation(["share", "common"]);
  const inputFile: React.MutableRefObject<null | HTMLInputElement> =
    React.useRef(null);
  const [text, setText] = React.useState("");
  const toast = useToast();

  const handleAttachFileClick = () => {
    // `current` points to the mounted file input element
    if (inputFile !== null && inputFile.current !== null) {
      inputFile.current.value = "";
      inputFile.current.click();
    }
  };

  const toastSuccess = (title: string, detail: string) => {
    toast({
      position: "top",
      title: title,
      description: detail,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const toastError = (title?: string, detail?: string) => {
    toast({
      position: "top",
      title: title ? title : t("errMsgTitleGeneric", { ns: "common" }),
      description: detail ? detail : t("errMsgDetailGeneric", { ns: "common" }),
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAttchFileUpload = () => {
    if (
      inputFile !== null &&
      inputFile.current !== null &&
      inputFile.current.files !== null &&
      inputFile.current.files[0] !== undefined
    ) {
      console.log(inputFile.current.files[0]);

      const FILE_SIZE_LIMIG = 20000000;
      if (inputFile.current.files[0].size > FILE_SIZE_LIMIG) {
        toastError(
          t("errMsgTitleFileTooLarge"),
          t("errMsgDetailFileTooLarge", { limit: FILE_SIZE_LIMIG / 1000000 })
        );
        return;
      }

      const formData = new FormData();
      formData.append("attachment", inputFile.current.files[0]);
      axios
        .post(`upload/?session_id=${session}`, formData, {
          headers: {
            "Content-Type": inputFile.current.files[0].type,
            "Content-Disposition": `attachment; filename=${inputFile.current.files[0].name}`,
          },
        })
        .then((res) => {
          toastSuccess(
            t("successMsgTitleFileUploaded"),
            t("successMsgDetailFileUploaded")
          );
        })
        .catch((err) => {
          toastError(
            t("errMsgTitleRoomDoesNotExist"),
            t("errMsgDetailRoomDoesNotExist")
          );
        });
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLElement>) => {
    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0 &&
      inputFile !== null &&
      inputFile.current !== null
    ) {
      e.preventDefault();
      inputFile.current.files = e.dataTransfer.files;
      handleAttchFileUpload();
      e.dataTransfer.clearData();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleShareText = () => {
    if (text.length === 0) {
      toastError(t("errMsgTitleEmptyText"), t("errMsgDetailEmptyText"));
      return;
    }

    axios
      .post("text/", { session_id: session, content: text })
      .then((res) => {
        toastSuccess(
          t("successMsgTitleTextShared"),
          t("successMsgDetailTextShared")
        );
      })
      .catch((err) => {
        toastError(
          t("errMsgTitleRoomDoesNotExist"),
          t("errMsgDetailRoomDoesNotExist")
        );
      });
  };

  return (
    <Flex direction="column" width="full" marginBottom="1">
      <Box borderRadius="md"></Box>
      <Textarea
        marginTop="1"
        placeholder={t("textAreaPlaceholder")}
        value={text}
        onDrop={handleFileDrop}
        onChange={handleTextChange}
      />
      <HStack marginTop="3">
        <Button
          colorScheme="blue"
          leftIcon={<AttachmentIcon />}
          onClick={handleAttachFileClick}
          width="min"
        >
          {t("shareFileButton")}
        </Button>
        <Button
          colorScheme="green"
          onClick={handleShareText}
          leftIcon={<CheckIcon />}
          width="min"
        >
          {t("shareTextButton")}
        </Button>
        <input
          type="file"
          id="file"
          ref={inputFile}
          onChange={handleAttchFileUpload}
          style={{ display: "none" }}
        />
      </HStack>
    </Flex>
  );
});

export { ShareBar };
