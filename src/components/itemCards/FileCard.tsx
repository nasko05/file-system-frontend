import {Card, Grid, Typography} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

type FileCardProps = {
    file: string;
}

export default function FileCard({file}: FileCardProps) {
    return (
        <Grid item xs={12} sm={6} md={4} key={file}>
            <Card
                variant="outlined"
                sx={{
                    height: 150,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 3,
                    boxShadow: 1,
                    transition: "transform 0.2s",
                    "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 4,
                    },
                }}
            >
                <DescriptionIcon sx={{ fontSize: 36, color: "#888" }} />
                <Typography mt={1}>{file}</Typography>
            </Card>
        </Grid>
    )
}