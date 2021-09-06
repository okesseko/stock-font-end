import { Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
// import ReactDOM from 'react-dom';
// import CSVReader from 'react-csv-reader';
import ReadFile from './read-file';
import { api, defaultAxios } from "../../environment/api";
import { Button, InputNumber, Select } from "antd";

const QuickOrder = () => {
	let timer;
	const [stockId, setStockId] = useState(1);
	const [isRunning, setIsRunning] = useState(true);
	const [containerData, setContainerData] = useState([]);
	const [A1, setA1] = useState(0);
	const [B1, setB1] = useState(0);
	const [fiveTickRangeData, setFiveTickRangeData] = useState([]);
	const [rangeData, setRangeData] = useState([]);
	const [matchPrice, setMatchPrice] = useState();
	const [quantity, setQuantity] = useState(1);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [totalSize, setTotalSize] = useState(0);
	const [showType, setShowType] = useState("請選擇情境");
	const [timeRestriction, setTimeRestriction] = useState(0);
	
	// 標記A1、B1
	function matchFiveTick(price, type) {
		if (type == 'buyQuantity') {
			return price == B1;
		} else if (type == 'sellQuantity') {
			return price == A1;
		}
	}
	
	// 限價單
	function sendOrder(data) {
		if (showType == "請選擇情境") {
			defaultAxios({
				url: api.postOrder.url,
				method: api.postOrder.method,
				data: {
					investorId: 1,
					stockId: 1,
					method: data.method, // BUY = 0, SELL = 1
					price: data.price,
					quantity: data.quantity,
					priceType: data.priceType, // MARKET = 0, LIMIT = 1
					timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
				},
			}).then((res) => {
				refreshDisplay(showType);
			});
		} else {
			defaultAxios({
				url: api.postVirtualOrder.url,
				method: api.postVirtualOrder.method,
				data: {
					method: data.method, // BUY = 0, SELL = 1
					price: data.price,
					quantity: data.quantity,
					priceType: data.priceType, // MARKET = 0, LIMIT = 1
					timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
					virtualOrderContainerId: showType,
				},
			}).then((res) => {
				setData(res.data);
			});
		}
	}

	// 市價單
	function sendMarketOrder(data) {
		if (showType == "請選擇情境") {
			defaultAxios({
				url: api.postOrder.url,
				method: api.postOrder.method,
				data: {
					investorId: 1,
					stockId: 1,
					method: data.method, // BUY = 0, SELL = 1
					price: data.price,
					quantity: data.quantity,
					priceType: data.priceType, // MARKET = 0, LIMIT = 1
					timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
				},
			}).then((res) => {
				refreshDisplay(showType);
			});
		} else {
			defaultAxios({
				url: api.postVirtualOrder.url,
				method: api.postVirtualOrder.method,
				data: {
					method: data.method, // BUY = 0, SELL = 1
					price: data.price,
					quantity: data.quantity,
					priceType: data.priceType, // MARKET = 0, LIMIT = 1
					timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
					virtualOrderContainerId: showType,
				},
			}).then((res) => {
				setData(res.data);
			});
		}
	}

	// 取消單
	function cancelOrder(data) {
		if (showType == "請選擇情境") {
			defaultAxios({
				url: api.postOrder.url,
				method: api.postOrder.method,
				data: {
					investorId: 1,
					stockId: 1,
					method: data.method, // BUY = 0, SELL = 1
					price: data.price,
					quantity: data.quantity,
					priceType: data.priceType, // MARKET = 0, LIMIT = 1
					timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
					subMethod: 0,
				},
			}).then((res) => {
				refreshDisplay(showType);
			});
		} else {
			defaultAxios({
				url: api.postVirtualOrder.url,
				method: api.postVirtualOrder.method,
				data: {
					method: data.method, // BUY = 0, SELL = 1
					price: data.price,
					quantity: data.quantity,
					priceType: data.priceType, // MARKET = 0, LIMIT = 1
					timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
					subMethod: 0,
					virtualOrderContainerId: showType,
				},
			}).then((res) => {
				setData(res.data);
			});
		}
	}

	function refreshDisplay(showType) {
		if (showType == "請選擇情境") {
			defaultAxios({
				url: api.getDisplay.url,
				method: api.getDisplay.method,
				params: {
					isGetLatest: true,
				},
			}).then((res) => {
				setData(res.data);
			});
		} else {
			defaultAxios({
				url: api.getVirtualOrder.url + '/' + showType,
				method: api.getVirtualOrder.method,
				params: {
					isGetLatest: true,
				},
			}).then((res) => {
				setData(res.data.display);
			});
		}
	}

	function setData(data) {
		setFiveTickRangeData(data.fiveTickRange);
		setRangeData(data.tickRange);
		setMatchPrice(data.matchPrice);

		let newFiveTickRangeData = JSON.parse(JSON.stringify(fiveTickRangeData))
		newFiveTickRangeData = newFiveTickRangeData.sort((a, b) => a.price - b.price)

		fiveTickRangeData.forEach(function (item) {
			if (item.sellQuantity > 0) {
				setA1(item.price);
			}
		})
		newFiveTickRangeData.forEach(function (item) {
			if (item.buyQuantity > 0) {
				setB1(item.price);
			}
		})
	}

	useEffect(() => {
		defaultAxios({
			url: api.getVirtualOrderContainer.url,
			method: api.getVirtualOrderContainer.method,
			params: {
				page: { page: page, pageSize: pageSize },
			},
		}).then((res) => {
			let data = [];
			res.data.content.forEach(function (content) {
				data.push({
					label: content.name,
					value: content.id,
				})
			});
			setContainerData(data);
			setTotalSize(res.data.totalSize);
		});

		if (isRunning) {
			timer = setInterval(() => {
				refreshDisplay(showType);
			}, 1000)
		} else {
			// refreshDisplay(showType);
		}

		return () => clearInterval(timer)
	}, [isRunning]);

	return (
		<div className="w-10/12 mx-auto">
			<div>
				<ReadFile />
				<hr className="mb-5" />
			</div>
			<div>
				<Select
					value={showType}
					style={{ width: 120, marginBottom: '10px', marginRight: '10px' }}
					onChange={(value) => {
						setIsRunning(false);
						clearInterval(timer);
						setShowType(value);
						refreshDisplay(value);
					}}
					options={containerData}
				/>

				<InputNumber min={1} defaultValue={quantity}
					style={{ marginRight: '10px' }}
					onChange={(value) => {
						setQuantity(value);
					}}
				/>

				<Select
					value={timeRestriction}
					style={{ width: 120, marginBottom: '10px', marginRight: '10px' }}
					onChange={(value) => {
						setTimeRestriction(value);
					}}
					options={[
						{							
							label: 'ROD',
							value: 0,
						},
						{
							label: 'IOC',
							value: 1,
						},
						{
							label: 'FOK',
							value: 2,
						},
					]}
				/>
				
				<Button
					type="primary"
					danger
					onClick={() => {
						defaultAxios({
							url: api.resetVirtualOrder.url + '/' + showType,
							method: api.resetVirtualOrder.method,
							data: {
								id: 1,
								isReset: true,
							},
						}).then(() => {
							refreshDisplay(showType);
						});
					}}
				>
					Reset
				</Button>
			</div>


			<div className="flex mb-1 items-center">
				<Button className="w-full" style={{ background: 'lightpink', borderColor: 'lightpink' }}
					onClick={() => {
						sendMarketOrder({
							method: 0,
							price: 0,
							quantity: quantity,
							priceType: 0,
						})
					}}
				>
					&nbsp;
				</Button>
				<div className={'bg-blue-300 text-center w-1/4 mx-1 h-full py-1.5'}>
					市價
				</div>
				<Button className="w-full py-3" style={{ background: 'lightgreen', borderColor: 'lightgreen' }}
					onClick={() => {
						sendMarketOrder({
							method: 1,
							price: 0,
							quantity: quantity,
							priceType: 0,
						})
					}}
				>
					&nbsp;
				</Button>
			</div>
			<hr className="my-2" />
			<div className="flex mb-1 items-center">
				<Button className="w-1/2 mr-1" style={{ background: 'none', border: 'none' }}
				>
					取消單
				</Button>
				<Button className="w-1/2" style={{ background: 'none', border: 'none' }}
				>
					限價單
				</Button>
				<div className={'text-center w-1/4 mx-1 h-full py-1.5'}>
					&nbsp;
				</div>
				<Button className="w-1/2 mr-1" style={{ background: 'none', border: 'none' }}
				>
					限價單
				</Button>
				<Button className="w-1/2" style={{ background: 'none', border: 'none' }}
				>
					取消單
				</Button>
			</div>
			{rangeData.map(
				(range, key) => (
					<div key={key} className="flex mb-1 items-center">
						<Button className="w-1/2 mr-1" style={{ background: '#ffb6c180', borderColor: 'lightpink' }}	
							onClick={() => {
								cancelOrder({
									method: 0,
									price: range.price,
									quantity: quantity,
									priceType: 1,
								})
							}}
						>
							&nbsp;
						</Button>
						<Button className="w-1/2" style={{ background: (matchFiveTick(range.price, 'buyQuantity')) ? 'lightcoral' : 'lightpink', borderColor: 'lightpink' }}
							onClick={() => {
								sendOrder({
									method: 0,
									price: range.price,
									quantity: quantity,
									priceType: 1,
								})
							}}
						>
							{(range.buyQuantity > 0) ? range.buyQuantity : ' '}
						</Button>
						<div className={((matchPrice == range.price) ? 'bg-yellow-400' : 'bg-yellow-200' ) + ' text-center w-1/4 mx-1 h-full py-1.5'}>
							{range.price}
						</div>
						<Button className="w-1/2 mr-1" style={{ background: (matchFiveTick(range.price, 'sellQuantity')) ? 'lightseagreen' : 'lightgreen', borderColor: 'lightgreen' }}
							onClick={() => {
								sendOrder({
									method: 1,
									price: range.price,
									quantity: quantity,
									priceType: 1,
								})
							}}
						>
							{(range.sellQuantity > 0) ? range.sellQuantity : ' '}
						</Button>
						<Button className="w-1/2" style={{ background: '#90ee9080', borderColor: 'lightgreen' }}
							onClick={() => {
								cancelOrder({
									method: 1,
									price: range.price,
									quantity: quantity,
									priceType: 1,
								})
							}}
						>
							&nbsp;
						</Button>
					</div>
				)
			)}
		</div >
	);
};

export default QuickOrder;
