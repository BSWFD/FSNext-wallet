"use client";

import { useEffect } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
	getSortedRowModel
} from "@tanstack/react-table";
import { getTableData } from "@/lib/fetchData";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { TablePagination } from "./TablePagination";
import { ArrowUpDown } from "lucide-react"

export type DataType = {
	token0: string;
	token1: string;
	txCount: string;
	volumeUSD: string;
	liquidity: string;
	totalValueLockedUSD: string;
};

export const columns: ColumnDef<DataType>[] = [
	{
		accessorKey: "token0",
		header: ({ column }) => {
			return (
				<Button
					className="flex  bg-none m-0 shadow-none text-black hover:scale-100"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					TOKEN 0
					<ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("token0")}</div>
		),
	},
	{
		accessorKey: "token1",
		header: ({ column }) => {
			return (
				<Button
					className="flex  bg-none m-0 shadow-none text-black hover:scale-100"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					TOKEN 1
					<ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("token1")}</div>
		),
	},
	{
		accessorKey: "totalValueLockedUSD",
		header: ({ column }) => {
			return (
				<Button
					className="flex  bg-none m-0 shadow-none text-black hover:scale-100"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					AMOUNT
					<ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="capitalize"><span className="font-bold">$</span>{row.getValue("totalValueLockedUSD")}</div>
		),
	},
	{
		accessorKey: "txCount",
		header: ({ column }) => {
			return (
				<Button
					className="flex  bg-none m-0 shadow-none text-black hover:scale-100"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					TXN
					<ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("txCount")}</div>
		),
	},
	{
		accessorKey: "volumeUSD",
		header: ({ column }) => {
			return (
				<Button
					className="flex  bg-none m-0 shadow-none text-black hover:scale-100"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					VOLUME
					<ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="capitalize"><span className="font-bold">$</span>{row.getValue("volumeUSD")}</div>
		),
	},
	{
		accessorKey: "liquidity",
		header: ({ column }) => {
			return (
				<Button
					className="flex  bg-none m-0 shadow-none text-black hover:scale-100"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					LIQUIDITY
					<ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="capitalize"><span className="font-bold">$</span>{row.getValue("liquidity")}</div>
		),
	},
];

const UNISWAP_URL = "uniswap/uniswap-v3";
const PANCAKESWAP_URL = "pancakeswap/exchange-v3-eth";

export function MyTable({ setter, isConnected }: any) {
	const [displayType, setDisplayType] = useState("All");
	const [data, setData] = useState<DataType[]>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [isLoading, setIsLoading] = useState("No results");

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	const fetchData = async () => {
		let uniswapData: any, pancakeswapData: any;

		setData([]);
		setIsLoading("Loading Data...");
		switch (displayType) {
			case "All":
				uniswapData = await getTableData(UNISWAP_URL);
				pancakeswapData = await getTableData(PANCAKESWAP_URL);
				setData([...uniswapData, ...pancakeswapData] as DataType[]);
				break;
			case "Uniswap":
				uniswapData = await getTableData(UNISWAP_URL);
				setData(uniswapData as DataType[]);
				break;
			case "Pancakeswap":
				pancakeswapData = await getTableData(PANCAKESWAP_URL);
				setData(pancakeswapData as DataType[]);
				break;
		}
		setIsLoading("No results!");
	};

	useEffect(() => {
		fetchData();
	}, [displayType]);

	return (
		<>
			<nav className="z-20 h-[80px] bg-gray-700 flex items-center justify-between w-full">
				<ul className="text-white text-lg flex items-center justify-between w-[300px] mx-3">
					<li className="lg:hidden">
						<Button className="text-4xl flex text-white bg-none m-0 shadow-none" onClick={() => {
							setter((oldVal: any) => !oldVal);
						}}>
							<img src="./img/sidebar-small.png" width="32px" height="32px" className="min-w-8 min-h-8" />
						</Button>
					</li>
					<li className={`ml-2 lg:ml-8 cursor-pointer ${displayType == "All" ? "text-red-500 hover:text-red-500" : "text-white hover:text-blue-500 "}`}
						onClick={() => setDisplayType("All")}
					>
						All
					</li>
					<li className={`cursor-pointer ${displayType == "Uniswap" ? "text-red-500 hover:text-red-500" : "text-white hover:text-blue-500 "}`}
						onClick={() => setDisplayType("Uniswap")}
					>
						Uniswap
					</li>
					<li className={`cursor-pointer ${displayType == "Pancakeswap" ? "text-red-500 hover:text-red-500" : "text-white hover:text-blue-500 "}`}
						onClick={() => setDisplayType("Pancakeswap")}
					>
						Pancakeswap
					</li>
				</ul>
			</nav>
			{
				isConnected ?
					<div className="w-[95%] mx-auto my-auto rounded-xl px-5 py-3 bg-white">
						<div className="flex items-center py-4 justify-between">
							<Label className="text-3xl font-bold ml-7">{displayType}</Label>
							<Input className="max-w-sm" placeholder="Filter by TOKEN 0"
								value={(table.getColumn("token0")?.getFilterValue() as string) ?? ""}
								onChange={(event) => table.getColumn("token0")?.setFilterValue(event.target.value)}
							/>
						</div>
						<div className="rounded-md border mb-5">
							<Table>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => {
												return (
													<TableHead key={header.id} className="border border-gray-200 text-center">
														{header.isPlaceholder
															? null
															: flexRender(
																header.column.columnDef.header,
																header.getContext()
															)}
													</TableHead>
												);
											})}
										</TableRow>
									))}
								</TableHeader>
								<TableBody className="text-center">
									{table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map((row) => (
											<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id} className="border border-gray-200">
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={columns.length} className="h-24 text-center">
												{isLoading}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						<TablePagination table={table} />
					</div>
					: <div className="w-full h-full flex items-center justify-center">
						<p className="text-5xl font-bold">
							You have to connect Wallet!
						</p>
					</div>
			}
		</>
	);
}
