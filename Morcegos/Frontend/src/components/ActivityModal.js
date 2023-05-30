import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, CircularProgress } from "@mui/material";
import { createActivity } from "../Manager/ContractManager.js";

const ActivityModal = ({ onActivityCreated }) => {

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [requiredApprovals, setRequiredApprovals] = useState('');
    const [tokenURI, setTokenURI] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        if (!title || !description || !reward || !requiredApprovals || !tokenURI) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        setError(null);

        createActivity(title, description, reward, requiredApprovals, tokenURI,
            () => {
                setLoading(false);
                handleClose();
                onActivityCreated();
            },
            () => {
                setLoading(false);
                setError('Erro ao criar atividade. Por favor, tente novamente.');
            }
        );
    }

    return (
        <div>
            <Button variant="contained" style={{ marginRight: '8px' }} onClick={handleOpen}>
                Criar Atividade
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Criar Atividade</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Título"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="Descrição"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="reward"
                        label="Recompensa"
                        type="number"
                        fullWidth
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="requiredApprovals"
                        label="Aprovações necessárias"
                        type="number"
                        fullWidth
                        value={requiredApprovals}
                        onChange={(e) => setRequiredApprovals(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="tokenURI"
                        label="URI do token"
                        type="text"
                        fullWidth
                        value={tokenURI}
                        onChange={(e) => setTokenURI(e.target.value)}
                    />
                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleCreate}>
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Criar"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ActivityModal;