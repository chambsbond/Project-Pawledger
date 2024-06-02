"use client"

import { Container, Paper, Stack, Typography, Checkbox, FormGroup, FormControlLabel, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function FoundAnimal() {
    const [isChipped, setIsChipped] = useState(false);
    const [hasIdentifier, sethasIdentifier] = useState(false);

    return (
        <Container>
            <Paper>
                <Stack padding={10} spacing={4}>
                    <Typography textAlign="center" variant="h3">Found Animal</Typography>
                    <FormGroup>
                        <Stack padding={5} spacing={3}>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography fontWeight="bold">
                                    Does the animal have an animal collar with the owner&apos;s contact information?
                                    </Typography>
                                <Checkbox
                                    checked={hasIdentifier}
                                    onChange={(e) => sethasIdentifier(e.target.checked)} />
                            </Stack>
                            {hasIdentifier &&
                                <Typography variant="body1">Since the animal has an animal collar please use the contact information to attempt communication
                                    with the owner prior to using the rest of this form</Typography>
                            }
                            {!hasIdentifier &&
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography fontWeight="bold">
                                        I have attempted communication with the owner and didn&apos;t make contact and the animal is chipped
                                        </Typography>
                                    <Checkbox
                                        checked={isChipped}
                                        onChange={(e) => setIsChipped(e.target.checked)} />

                                </Stack>
                            }
                            {isChipped &&
                                <>
                                    <TextField required variant="outlined" label="Animal's PET Id Number"></TextField>
                                    <Button variant="contained">Notify Animal&apos;s Owner*</Button>
                                    <Typography variant="body2">*Submitting this form will notify the owner that your organization is in possession of the animal
                                        and will begin a counter that when expired will automatically transfer ownership of the animal to your organization.
                                    </Typography>
                                </>
                            }


                        </Stack>
                    </FormGroup>
                </Stack>
            </Paper>
        </Container>);
}