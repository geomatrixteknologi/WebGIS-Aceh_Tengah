import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { logged } from "@/utility/Interfaces";

const AvatarProfile = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios
      .get<logged>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        setUsername(res.data.data.username);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: name[0],
    };
  }

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
        <Box>
          <Avatar {...stringAvatar(username)} />
        </Box>
      </Box>
    </>
  );
};

export default AvatarProfile;
