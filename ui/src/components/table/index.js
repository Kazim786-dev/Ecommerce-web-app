/* eslint-disable react/prop-types */
import React from 'react'
import { Table } from 'react-bootstrap'

const DetailsTable = ({
	data,
	columns,
}) => {


	return (
		
		<Table borderless responsive >
			<thead>
				<tr>
					{columns.map((column, index) => (
						<th key={index} className="header-cell">
							{column.header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.length > 0 &&
						data.map((item, index) => (
							<tr key={index}>
								{columns.map((column, index) => (
									<td key={index} style={{ width: column.width }}>
										{column.render(item)}
									</td>
								))}
							</tr>
						))}
			</tbody>
		</Table>
	)
}

export default DetailsTable