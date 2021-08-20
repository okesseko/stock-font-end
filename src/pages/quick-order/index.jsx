import { Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { api, defaultAxios } from "../../environment/api";
import { Button, InputNumber, Select } from "antd";

const QuickOrder = () => {
	const [containerData, setContainerData] = useState([]);
	const [rangeData, setRangeData] = useState([]);
	const [quantity, setQuantity] = useState(1);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [totalSize, setTotalSize] = useState(0);
	const [showType, setShowType] = useState("請選擇情境");
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
				refreshDefaultDisplay();
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
				refreshDisplay(showType);
			});
		}
	}

	function refreshDefaultDisplay() {
		defaultAxios({
			url: api.getDisplay.url,
			method: api.getDisplay.method,
			params: {
				isGetLatest: true,
			},
		}).then((res) => {
			setRangeData(res.data.tickRange);
		});
	}

	function refreshDisplay(id) {
		defaultAxios({
			url: api.getVirtualOrder.url + '/' + id,
			method: api.getVirtualOrder.method,
			params: {
				isGetLatest: true,
			},
		}).then((res) => {
			setRangeData(res.data.display.tickRange);
		});
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

		refreshDefaultDisplay();
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
						<Button className="w-full" style={{ background: 'lightpink', borderColor: 'lightpink' }}
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
							{range.buyQuantity}
						</Button>
						<div className="bg-yellow-200 text-center w-1/4 mx-1 h-full py-1.5">
							{range.price}
						</div>
						<Button className="w-full" style={{ background: 'lightgreen', borderColor: 'lightgreen' }}
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
							{range.sellQuantity}
						</Button>
					</div>
				)
			)}
		</div >
	);
};

export default QuickOrder;
