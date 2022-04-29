import * as React from "react";
import { axiosInstance as axios } from "../../axios";
import { FileCard, IFileCard } from "./FileCard";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface ISharedFiles {
  session: string;
  password: string;
}

interface ISharedFilesState {
  files: [string];
}

const SharedFiels = React.memo(
  ({ session, password }: ISharedFiles): JSX.Element => {
    const { t } = useTranslation("share");
    const backgroundColor = useColorModeValue("gray.100", "gray.600");

    const [sharedFiles, setSharedFiles] = React.useState<
      ISharedFilesState | undefined
    >();

    React.useEffect(() => {
      const interval = setInterval(
        () => pullSharedFile({ session, password }),
        5000
      );
      return () => {
        clearInterval(interval);
      };
    }, [session]);

    const pullSharedFile = async ({ session, password }: ISharedFiles) => {
      await axios
        .get(`upload/?session_id=${session}&password=${password}`)
        .then((res) => {
          if (res.data !== "") {
            console.log(res.data);
            setSharedFiles(res.data);
          }
        });
    };

    return (
      <Flex
        borderRadius="md"
        direction="column"
        width="full"
        height="52"
        marginBottom="10"
        backgroundColor={backgroundColor}
        overflowY="auto"
      >
        <Text padding="3" fontWeight="bold">
          {t("sharedFileAreaTitle")}
        </Text>
        {sharedFiles === undefined
          ? null
          : sharedFiles.files.map((file: string, index: number) => {
              return <FileCard fileName={file} session={session} key={index} />;
            })}
      </Flex>
    );
  }
);

export { SharedFiels };
