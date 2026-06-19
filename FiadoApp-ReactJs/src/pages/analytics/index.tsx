import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { GenericContainer, PageContainer } from "../../components/Containers";
import { Header } from "../../components/General";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import api from "../../services/api";

/* CHART.JS */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

function Analytics() {

    const hoje = new Date();
    const primeiroDiaMes = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
    ).toISOString().split("T")[0];

    const [de, setDe] = useState(primeiroDiaMes);
    const [ate, setAte] = useState(
        hoje.toISOString().split("T")[0]
    );

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const fetchAnalytics = async () => {
        setLoading(true);
        setErro("");

        try {
            const resp = await api.get(
                `/analytics?de=${de}&ate=${ate}`
            );

            setData(resp.data);

        } catch (e) {
            setErro("Erro ao buscar analytics");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleBuscar = (e) => {
        e.preventDefault();
        fetchAnalytics();
    };

    /* =========================
       SAFE RESUMO
    ========================= */

    const resumo = data?.resumo || {};

    const faturamentoBruto = resumo.faturamento_bruto || 0;
    const totalRecebido = resumo.total_recebido || 0;
    const totalAberto = resumo.total_aberto || 0;
    const vendasAtivas = resumo.vendas_abertas || 0;
    const vendasTotal = resumo.total_vendas || 0;
    const clientesAtendidos = resumo.clientes_atendidos || 0;

    /* =========================
       CHART DATA
    ========================= */

    const lineLabels =
        data?.faturamento_por_dia?.map(d =>
            new Date(d.dia).toLocaleDateString("pt-BR")
        ) || [];

    const lineValues =
        data?.faturamento_por_dia?.map(d => d.total) || [];

    const barLabels =
        data?.top_clientes?.map(c =>
            c.nome + (c.referencia ? ` (${c.referencia})` : "")
        ) || [];

    const barValues =
        data?.top_clientes?.map(c => c.qtd_vendas) || [];

    const pieValues = [
        data?.por_status?.find(x => x.status === "PAGA")?.qtd || 0,
        data?.por_status?.find(x => x.status === "ATIVA")?.qtd || 0
    ];

    /* LINE */
    const lineChart = {
        labels: lineLabels,
        datasets: [
            {
                label: "Faturamento diário",
                data: lineValues,
                borderColor: "#4ADE80",
                backgroundColor: "rgba(74,222,128,0.2)",
                tension: 0.4
            }
        ]
    };

    /* PIE */
    const pieChart = {
        labels: ["Pagas", "Em aberto"],
        datasets: [
            {
                data: pieValues,
                backgroundColor: ["#4ADE80", "#FA3E3E"],
                borderWidth: 0
            }
        ]
    };

    /* BAR (VERTICAL CLIENTES) */
    const barChart = {
        labels: barLabels,
        datasets: [
            {
                label: "Qtd. vendas",
                data: barValues,
                backgroundColor: "#4ADE80",
                borderRadius: 6
            }
        ]
    };

    return (
        <>
            <Header />

            <div className="flex items-center px-5 pt-3">
                <Button
                    component={Link}
                    to="/home"
                    variant="contained"
                    color="secondary"
                    startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                >
                    Voltar
                </Button>
            </div>

            <PageContainer className="text-white">
                <GenericContainer className="w-6xl rounded-2xl bg-[#181829] gap-6">

                    {/* HEADER */}
                    <div className="flex flex-col gap-4">

                        <h1 className="text-3xl font-bold">
                            Analytics
                        </h1>

                        <form
                            onSubmit={handleBuscar}
                            className="flex gap-4 flex-wrap"
                        >
                            <TextField
                                type="date"
                                value={de}
                                onChange={(e) => setDe(e.target.value)}
                            />

                            <TextField
                                type="date"
                                value={ate}
                                onChange={(e) => setAte(e.target.value)}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                            >
                                Filtrar
                            </Button>
                        </form>
                    </div>

                    {/* CARDS (CONTADORES) */}
                    {!loading && data && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                            <Metric title="Vendas ativas" value={vendasAtivas} />
                            <Metric title="Total vendas" value={vendasTotal} />
                            <Metric title="Clientes atendidos" value={clientesAtendidos} />

                            <Metric
                                title="Faturamento bruto"
                                value={`R$ ${faturamentoBruto.toFixed(2)}`}
                            />

                            <Metric
                                title="Valor recebido"
                                value={`R$ ${totalRecebido.toFixed(2)}`}
                            />

                            <Metric
                                title="Valor a receber"
                                value={`R$ ${totalAberto.toFixed(2)}`}
                            />
                        </div>
                    )}

                    {/* STATES */}
                    {loading && <p>Carregando...</p>}
                    {erro && <p className="text-red-500">{erro}</p>}

                    {/* CHARTS */}
                    {!loading && data && (
                        <div className="flex flex-col gap-6">

                            {/* LINE + PIE */}
                            <div className="grid md:grid-cols-2 gap-4">

                                <div className="bg-[#22223c] p-4 rounded-xl">
                                    <h2 className="mb-2 font-semibold">
                                        Faturamento por dia
                                    </h2>
                                    <Line data={lineChart} />
                                </div>

                                <div className="bg-[#22223c] p-4 rounded-xl">
                                    <h2 className="mb-2 font-semibold">
                                        Status das vendas
                                    </h2>
                                    <Doughnut data={pieChart} />
                                </div>

                            </div>

                            {/* BAR CLIENTES (VERTICAL OK) */}
                            <div className="bg-[#22223c] p-4 rounded-xl">
                                <h2 className="mb-2 font-semibold">
                                    Top clientes
                                </h2>

                                <Bar
                                    data={barChart}
                                    options={{
                                        indexAxis: "x" // 🔥 garante barras verticais
                                    }}
                                />
                            </div>

                        </div>
                    )}

                </GenericContainer>
            </PageContainer>
        </>
    );
}

/* =========================
   CARD DE MÉTRICA
========================= */
function Metric({ title, value }) {
    return (
        <Card sx={{ backgroundColor: "#1E1E2E", color: "#fff" }}>
            <CardContent>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

export default Analytics;