import * as React from "react";
import { axiosInstance as axios } from "../../axios";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Input,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { BackToSelectButton } from "./BackToSelectButton";
import { useTranslation } from "react-i18next";

const CreateSession = React.memo((): JSX.Element => {
  const nevigate = useNavigate();
  const { t } = useTranslation("createSession");
  const [password, setPassword] = React.useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCreateButtonClick = () => {
    axios
      .post("session/", { password: password })
      .then((res: AxiosResponse) => {
        nevigate("/share", {
          replace: true,
          state: { session: res.data.session_id, password: res.data.password },
        });
      });
  };

  return (
    <Center width="full" paddingTop="20vh">
      <Flex
        direction="column"
        justify="center"
        width="3xl"
        height="15em"
        margin="3"
      >
        <BackToSelectButton />
        <Text fontSize="xl">{t("title")}</Text>
        <Spacer />
        <Input
          placeholder={t("passwordPlaceholder")}
          onChange={handlePasswordChange}
          value={password}
        ></Input>
        <Spacer />
        <Alert borderRadius="md" status="info">
          <AlertIcon />
          {t("passwordNotice")}
        </Alert>
        <Spacer />
        <Button
          colorScheme="teal"
          onClick={handleCreateButtonClick}
          width={["100%", null, "35%"]}
        >
          {t("createButton")}
        </Button>
      </Flex>
    </Center>
  );
});

export { CreateSession };
