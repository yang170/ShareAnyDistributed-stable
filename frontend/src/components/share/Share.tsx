import * as React from "react";
import {
  Tag,
  Flex,
  TagLeftIcon,
  TagLabel,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { axiosInstance as axios } from "../../axios";
import { DeleteIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { InfoIcon } from "@chakra-ui/icons";
import { ShareBar } from "./ShareBar";
import { SharedFiels } from "./SharedFiles";
import { SharedText } from "./SharedText";
import { useTranslation } from "react-i18next";

interface ISessionLocation {
  session: string;
  password: string;
}

const Share = React.memo((): JSX.Element => {
  const { t } = useTranslation("share");
  const { state } = useLocation();
  const toast = useToast();
  const nevigate = useNavigate();
  const session = (state as ISessionLocation).session;
  const password = (state as ISessionLocation).password;

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

  const handleDeleteSession = () => {
    console.log(password);
    axios
      .delete(`session/?session_id=${session}`)
      .then(() => {
        nevigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // space already been deleted, safe to navigate to the homepage
          nevigate("/");
        } else {
          toastError();
        }
      });
  };

  return (
    <Flex margin="3" direction="column">
      <HStack marginBottom="5">
        <Tag size="lg" width="fit-content">
          <TagLeftIcon as={InfoIcon} />
          <TagLabel>
            {t("rid")} {session}
          </TagLabel>
        </Tag>
        <Button
          variant="outline"
          aria-label="Back"
          colorScheme="red"
          size="sm"
          onClick={handleDeleteSession}
          leftIcon={<DeleteIcon />}
        >
          {t("deleteRoom")}
        </Button>
      </HStack>
      <SharedFiels session={session} password={password} />
      <SharedText session={session} password={password} />
      <ShareBar session={session} />
    </Flex>
  );
});

export { Share };
