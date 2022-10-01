import { renderHook, waitFor } from "@testing-library/react"
import { DateTime } from "luxon"
import { terminateFirebase } from "../../tests/testUtils"
import { midnight } from "./common"
import { useUpcomingEvents } from "./events"
import { useUpcomingBills } from "./useUpcomingBills"

const mockedMidnight = jest.mocked(midnight)

afterAll(terminateFirebase)

describe("useUpcomingBills", () => {
  it("fetches bills", async () => {
    // Test the seeded events
    const cutoff = DateTime.utc(2022, 3, 8)
    mockedMidnight.mockReturnValue(cutoff.toJSDate())

    const { result } = renderHook(() => useUpcomingBills())

    await waitFor(() => expect(result.current).not.toHaveLength(0))
  })
})

describe("useUpcomingEvents", () => {
  it("fetches events", async () => {
    // Test the seeded events
    const cutoff = DateTime.utc(2022, 3, 8)
    mockedMidnight.mockReturnValue(cutoff.toJSDate())

    const { result } = renderHook(() => useUpcomingEvents())

    await waitFor(() => expect(result.current).not.toHaveLength(0))
  })
})
