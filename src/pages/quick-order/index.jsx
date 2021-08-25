import { Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { api, defaultAxios } from "../../environment/api";
import { Button, InputNumber, Select } from "antd";

const QuickOrder = () => {
	const [containerData, setContainerData] = useState([]);
	const [fiveTickrangeData, setFiveTickRangeData] = useState([]);
	const [rangeData, setRangeData] = useState([]);
	const [matchPrice, setMatchPrice] = useState();
	const [quantity, setQuantity] = useState(1);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [totalSize, setTotalSize] = useState(0);
	const [showType, setShowType] = useState("請選擇情境");
	function matchFiveTick(data, price, type) {
		if (type == 'buyQuantity') {
			return data.find((item) => { return item.price == price && item.buyQuantity != null })
		} else if (type == 'sellQuantity') {
			return data.find((item) => { return item.price == price && item.sellQuantity != null })
		}
	}
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
					timeRestriction: data.timeRestriction, // ROD = 0, IOC = 1, FOK = 2
				},
			}).then((res) => {
				refreshDisplay();
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
					timeRestriction: data.timeRestriction, // ROD = 0, IOC = 1, FOK = 2
					virtualOrderContainerId: showType,
				},
			}).then((res) => {
				refreshDisplay();
			});
		}
	}

	function refreshDisplay() {
		if (showType == "請選擇情境") {
			defaultAxios({
				url: api.getDisplay.url,
				method: api.getDisplay.method,
				params: {
					isGetLatest: true,
				},
			}).then((res) => {
				console.log(res.data)
				setFiveTickRangeData(res.data.fiveTickRange);
				setRangeData(res.data.tickRange);
				setMatchPrice(res.data.matchPrice);
			});
		} else {
			defaultAxios({
				url: api.getVirtualOrder.url + '/' + showType,
				method: api.getVirtualOrder.method,
				params: {
					isGetLatest: true,
				},
			}).then((res) => {
				setRangeData(res.data.display.tickRange);
				setMatchPrice(res.data.display.matchPrice);
			});
		}
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

		setInterval(() => {
			console.log(1);
			refreshDisplay();
		}, 1000)
	}, [page, pageSize]);

	return (
		<div className="w-10/12 mx-auto">
			<div>
				<Select
					value={showType}
					style={{ width: 120, marginBottom: '10px', marginRight: '10px' }}
					onChange={(value) => {
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
					重製情境
				</Button>
			</div>
			{rangeData.map(
				(range, key) => (
					<div key={key} className="flex mb-1 items-center">
						<Button className="w-full" style={{ background: (matchFiveTick(fiveTickrangeData, range.price, 'buyQuantity')) ? 'lightcoral' : 'lightpink', borderColor: 'lightpink' }}
							onClick={() => {
								sendOrder({
									method: 0,
									price: range.price,
									quantity: quantity,
									priceType: 1,
									timeRestriction: 0,
								})
							}}
						>
							{(range.buyQuantity > 0) ? range.buyQuantity : ' '}
						</Button>
						<div className={((matchPrice == range.price) ? 'bg-yellow-400' : 'bg-yellow-200' ) + ' text-center w-1/4 mx-1 h-full py-1.5'}>
							{range.price}
						</div>
						<Button className="w-full" style={{ background: (matchFiveTick(fiveTickrangeData, range.price, 'sellQuantity')) ? 'lightseagreen' : 'lightgreen', borderColor: 'lightgreen' }}
							onClick={() => {
								sendOrder({
									method: 1,
									price: range.price,
									quantity: quantity,
									priceType: 1,
									timeRestriction: 0,
								})
							}}
						>
							{(range.sellQuantity > 0) ? range.sellQuantity : ' '}
						</Button>
					</div>
				)
			)}
		</div >
	);
};

export default QuickOrder;
